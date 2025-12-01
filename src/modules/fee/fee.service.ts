import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "../../shared/prisma/prisma.service";
import { CreateFeeAssignmentDto } from './dto/create-assignment.dto';
import { CreateFeeDto } from './dto/create-fee.dto';

@Injectable()
export class FeeService {
  constructor(private prisma: PrismaService) {}

  // --- 1. QUẢN LÝ KHOẢN PHÍ (FEES) ---

  async create(dto: CreateFeeDto) {
    return this.prisma.fee.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      }
    });
  }
 async update(id: number, dto: Partial<CreateFeeDto>) {
 await this.findOne(id);

  const updateData: any = { ...dto };

  if (dto.startDate) updateData.startDate = new Date(dto.startDate);
  if (dto.endDate) updateData.endDate = new Date(dto.endDate);

  const updatedFee = await this.prisma.fee.update({
    where: { id },
    data: updateData,
  });

  const assignments = await this.prisma.feeAssignment.findMany({
    where: { feeId: id },
    include: {
      household: {
        include: {
          resident: true,
        },
      },
    },
  });

  const updateOperations = assignments.map(a =>
    this.prisma.feeAssignment.update({
      where: { id: a.id },
      data: {
        amountDue:
          a.household.resident.length * (updatedFee.ratePerPerson ?? 0) +
          (updatedFee.minium ?? 0),
      },
    })
  );

  await Promise.all(updateOperations);

  return updatedFee;
}

  async remove (id: number){
    await this.findOne(id);

    await this.prisma.feeAssignment.deleteMany({
      where: { feeId: id },
    });

    return this.prisma.fee.delete({where:{id}})
  }

  async findAll() {
    return this.prisma.fee.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
  }

  async findOne(id: number) {
    const fee = await this.prisma.fee.findUnique({ where: { id } });
    if (!fee) throw new NotFoundException('Không tìm thấy khoản phí');
    return fee;
  }

  // --- 2. QUẢN LÝ GÁN PHÍ (ASSIGNMENTS) ---
   async assignFee(dto: CreateFeeAssignmentDto) {
    const fee = await this.prisma.fee.findUnique({ where: { id: dto.feeId }});
    if (!fee) throw new NotFoundException("Fee không tồn tại");

    const households = await this.prisma.houseHolds.findMany({
      where: { id: { in: dto.householdIds }},
      include: { resident: true },
    });

    const data = households.map(h => ({
      feeId: dto.feeId,
      householdId: h.id,
      amountDue: (h.resident.length * (fee.ratePerPerson ?? 0)) + (fee.minium ?? 0),
      dueDate: new Date(dto.dueDate),
    }));

    return this.prisma.feeAssignment.createMany({ data });
  }
  async getFeeDetail(feeId: number) {
    return this.prisma.fee.findUnique({
      where: { id: feeId },
      include: {
        assignments: {
          include: {
            household: {
              select: {
                id: true,
                houseHoldCode: true,
                head: { select: { fullname: true } }}
            },
            Payment: true,
          }
        }
      }
    });
  }
  
  async getFeesOfHousehold(householdId: number) {
    return this.prisma.feeAssignment.findMany({
      where: { householdId },
      include: {
        fee: true,
        Payment: true
      }
    });
  }

  async getPaidFees(householdId: number) {
    return this.prisma.feeAssignment.findMany({
      where: { householdId, isPaid: true },
      include: {
        fee: true,
        Payment: true
      }
    });
  }

  async getUnpaidFees(householdId: number) {
    return this.prisma.feeAssignment.findMany({
      where: { householdId, isPaid: false },
      include: { fee: true }
    });
  }
}
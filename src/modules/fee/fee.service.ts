import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "../../shared/prisma/prisma.service";
import { CreateFeeAssignmentDto } from './dto/create-assignment.dto';
import { CreateFeeDto } from './dto/create-fee.dto';
import { Fee, FeeType, Prisma } from '@prisma/client';
@Injectable()
export class FeeService {
  constructor(private prisma: PrismaService) {}

  // --- 1. QUẢN LÝ KHOẢN PHÍ (FEES) ---
  private calculateAmount(fee: Fee, residentCount: number): number {
    if (fee.type === FeeType.MANDATORY) {
      return residentCount * (fee.ratePerPerson ?? 0);
    } else {
      return fee.minium ?? 0;
    }
  }

  async create(dto: CreateFeeDto) {
    const minium = dto.type === FeeType.MANDATORY ? 0 : dto.minium;
    const ratePerPerson = dto.type === FeeType.VOLUNTARY ? 0 : dto.ratePerPerson;

    return this.prisma.fee.create({
      data: {
        ...dto,
        minium: minium,           
        ratePerPerson: ratePerPerson, 
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
    where: { 
      feeId: id,
      isPaid: false      
    },
    include: {
      household: {
        include: {
          resident: true,
        },
      },
    },
  });

 const updateOperations = assignments.map(a => {
      const newAmount = this.calculateAmount(updatedFee, a.household.resident.length);
      
      return this.prisma.feeAssignment.update({
        where: { id: a.id },
        data: {
          amountDue: newAmount,
        },
      });
    });

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

  async findAll(params: {page?: number; limit?: number; search?: string}) {
    const { page = 1, limit = 5, search} = params;
    const skip = (page - 1) * limit;

    const whereCondition: Prisma.FeeWhereInput = search
      ? {
        OR:[
          {name: { contains: search, mode: 'insensitive'}}
        ],
      }:{};
    
    const [data, total]= await Promise.all([
      this.prisma.fee.findMany({
        where: whereCondition,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.fee.count({ where: whereCondition }),
    ]);
    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  
  async findOne(id: number) {
    const fee = await this.prisma.fee.findUnique({ where: { id } });
    if (!fee) throw new NotFoundException('Không tìm thấy khoản phí');
    return fee;
  }

  // --- 2. QUẢN LÝ GÁN PHÍ (ASSIGNMENTS) ---
   async assignFee(dto: CreateFeeAssignmentDto) {
    const fee = await this.prisma.fee.findUnique({ where: { id: dto.feeId }});
    if (!fee) throw new NotFoundException("Phí không tồn tại");

    const households = await this.prisma.houseHolds.findMany({
      where: { id: { in: dto.householdIds }},
      include: { resident: true },
    });

    const existingAssignments = await this.prisma.feeAssignment.findMany({
      where: {
        feeId: dto.feeId,
        householdId: { in: dto.householdIds }
      },
      select: { householdId: true }
    });

    const existingHouseholdIds = new Set(existingAssignments.map(a => a.householdId));

    const newAssignmentsData = households
      .filter(h => !existingHouseholdIds.has(h.id)) 
      .map(h => ({
        feeId: dto.feeId,
        householdId: h.id,
        amountDue: (h.resident.length * (fee.ratePerPerson ?? 0)) + (fee.minium ?? 0),
        dueDate: new Date(dto.dueDate),
      }));

    if (newAssignmentsData.length === 0) {
       return { count: 0, message: "Tất cả các hộ chọn đều đã được gán phí này rồi." };
    }

    return this.prisma.feeAssignment.createMany({ data: newAssignmentsData });
  }
  
  async getFeeDetail(
    feeId: number, 
    query: { page?: number; limit?: number; isPaid?: string }
  ) {
    const { page = 1, limit = 5, isPaid } = query;
    const skip = (page - 1) * limit;

    const fee = await this.prisma.fee.findUnique({
      where: { id: feeId },
    });

    if (!fee) throw new NotFoundException('Không tìm thấy khoản phí');

    const whereCondition: Prisma.FeeAssignmentWhereInput = {
      feeId: feeId,
    };

    if (isPaid === 'true') {
      whereCondition.isPaid = true;  
    } else if (isPaid === 'false') {
      whereCondition.isPaid = false; 
    }

    const [assignments, total] = await Promise.all([
      this.prisma.feeAssignment.findMany({
        where: whereCondition,
        skip: Number(skip),
        take: Number(limit),
        include: {
          household: {
            select: {
              id: true,
              houseHoldCode: true,
              apartmentNumber: true, 
              head: { select: { fullname: true } },
            },
          },
          Payment: true,
        },
        orderBy: {
          household: { apartmentNumber: 'asc' }
        }
      }),
      this.prisma.feeAssignment.count({ where: whereCondition }),
    ]);

    return {
      ...fee,
      assignments: {
        data: assignments,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    };
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
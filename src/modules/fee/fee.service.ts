import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from "../../shared/prisma/prisma.service";
import { CreateFeeAssignmentDto } from './dto/create-assignment.dto';
import { CreateFeeDto } from './dto/create-fee.dto';
import {Fee, FeeCalculationBase, Frequency, HouseHolds, HouseHoldStatus, Prisma, ResidenceStatus} from '@prisma/client';
import {CreateAndAssignFeeDto} from "./dto/create-and-assign-fee.dto";
import * as XLSX from 'xlsx';

import {CreateFeeAssignmentInput, ExcelRow, ImportError} from './dto/ExcelRow'
@Injectable()
export class FeeService {
  constructor(private prisma: PrismaService) {}

  async calculateAmount(fee: Fee, numCars, numMotorbike, numPeople): Promise<number>{
    if(!fee.rate) return 0;
    switch (fee.calculationBase){
      case FeeCalculationBase.PER_HOUSEHOLD:
        return fee.rate

      case FeeCalculationBase.PER_PERSON:
        return fee.rate*numPeople

      case FeeCalculationBase.PER_CAR:
        return fee.rate*numCars

      case FeeCalculationBase.PER_MOTORBIKE:
        return fee.rate*numMotorbike
      default:
        return 0
    }
  }

  async createFeeAssignment(dto: CreateFeeAssignmentDto) {
    return this.prisma.$transaction(async (tx) => {
      const fee = await tx.fee.findUniqueOrThrow({
        where: { id: dto.feeId },
      });

      const assignments: Prisma.FeeAssignmentCreateManyInput[] = [];

      for (const householdId of dto.householdIds) {
        const household = await this.prisma.houseHolds.findUniqueOrThrow({
          where: {id: householdId}
        })

        assignments.push({
          feeId: fee.id,
          householdId,
          amountDue: 1,//await this.calculateAmount(fee, household),
          dueDate: dto.dueDate,
        });
      }

      await tx.feeAssignment.createMany({
        data: assignments,
      });

      return {
        created: assignments.length,
      };
    });
  }

  async getFee(){

  }

  //ok
  async createOneTimeFee(dto: CreateAndAssignFeeDto) {
    if(dto.frequency != Frequency.ONE_TIME){
      throw new BadRequestException("this only for non repeatedly fee")
    }
    const {dueDate, ...data} = dto
    const fee = await this.prisma.fee.create({
      data: {
        ...data,
      }
    });
    return this.assignFeeV2(fee, dueDate)
  }

  async createFeeRepeat(dto: CreateFeeDto) {
    if(dto.frequency == Frequency.ONE_TIME){
      throw new BadRequestException("this only for repeatedly fee")
    }
    return this.prisma.fee.create({
      data: {
        ...dto,
      }
    });
  }

  async assignFeeV2(fee: Fee, dueDate: string = ""){
    const households = await this.prisma.houseHolds.findMany({
      where: {
        status: HouseHoldStatus.ACTIVE,
      },
      select: {
        id: true,
        numMotorbike: true,
        numCars: true,
        _count: {
          select: {
            resident: {
              where: {
                residentStatus: {
                  in: [
                    ResidenceStatus.NORMAL,
                    ResidenceStatus.TEMP_RESIDENT,
                  ],
                },
              },
            },
          },
        },
      },
    });

    const data: Prisma.FeeAssignmentCreateManyInput[] = [];

    for (const h of households) {
      const amountDue = await this.calculateAmount(
        fee,
        h.numCars,
        h.numMotorbike,
        h._count.resident,
      );

      data.push({
        feeId: fee.id,
        householdId: h.id,
        amountDue,
        dueDate: new Date(dueDate),
      });
    }

    return this.prisma.feeAssignment.createMany({ data });
  }

  async createFeeFromExcel(file: Express.Multer.File, dto: CreateAndAssignFeeDto) {
    const {dueDate, ...d} = dto
    const fee = await this.prisma.fee.create({
      data: {
        ...d,
      }
    });

    const workbook = XLSX.read(file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

    const normalizeCCCD = (v: string | number | null | undefined) =>
      String(v ?? '')
        .trim()
        .replace(/\s+/g, '');

    // @ts-ignore
    const data = rows.map((r) => ({
      cccd: normalizeCCCD(r.cccd),
      amount: Number(r.so_tien),
    }));

    const heads = await this.prisma.houseHolds.findMany({
      where: {
        status: HouseHoldStatus.ACTIVE,
      },
      select: {
        id: true,
        head: {
          select: {
            nationalId: true,
          },
        },
      },
    });

// 👇 normalize CCCD trong DB
    const headMap = new Map(
      heads.map((h) => [
        normalizeCCCD(h.head.nationalId),
        h.id,
      ]),
    );

    const errors: ImportError[] = [];
    const createData: CreateFeeAssignmentInput[] = [];

    for (const item of data) {
      const householdId = headMap.get(item.cccd);

      if (!householdId) {
        errors.push({
          cccd: item.cccd,
          reason: 'Không tìm thấy chủ hộ',
        });
        continue;
      }

      createData.push({
        householdId,
        feeId: fee.id,
        amountDue: item.amount,
        dueDate: new Date(dto.dueDate),
      });
    }

// // 👇 debug cực nhanh
//     console.log('createData:', createData);
//     console.log('rows:', rows.length);
//     console.log('parsed data:', data);
//     console.log('heads:', heads.length);
//     console.log('createData:', createData);


    return this.prisma.feeAssignment.createMany({
      data: createData,
      skipDuplicates: true,
    });
  }

  //ok
  async assignFee(dto: CreateFeeAssignmentDto) {
    const fee = await this.prisma.fee.findUnique({ where: { id: dto.feeId }});
    if (!fee) throw new NotFoundException("Phí không tồn tại");

    const households = await this.prisma.houseHolds.findMany({
      where: {
        id: { in: dto.householdIds },
      },
      select: {
        id: true,
        numMotorbike: true,
        numCars: true,
        _count: {
          select: {
            resident: {
              where: {
                residentStatus: {
                  in: [
                    ResidenceStatus.NORMAL,
                    ResidenceStatus.TEMP_RESIDENT,
                  ],
                },
              },
            },
          },
        },
      },
    });

    const data: Prisma.FeeAssignmentCreateManyInput[] = [];

    for (const h of households) {
      const amountDue = await this.calculateAmount(
        fee,
        h.numCars,
        h.numMotorbike,
        h._count.resident,
      );

      data.push({
        feeId: dto.feeId,
        householdId: h.id,
        amountDue,
        dueDate: new Date(dto.dueDate),
      });
    }

    return this.prisma.feeAssignment.createMany({ data });
  }
  //neu da gan va da co nguoi tra -> k update dc
  async updateFeeAssignment(id: number, dto: Partial<CreateFeeDto>) {
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Check nếu có assignment đã paid → chặn
      const paidCount = await tx.feeAssignment.count({
        where: {
          feeId: id,
          isPaid: true,
        },
      });

      if (paidCount > 0) {
        throw new ConflictException(
          "You can't change a fee that has paid assignments",
        );
      }

      // 2️⃣ Update fee
      const updatedFee = await tx.fee.update({
        where: { id },
        data: dto,
      });

      // 3️⃣ Lấy assignment chưa paid
      const assignments = await tx.feeAssignment.findMany({
        where: {
          feeId: id,
          isPaid: false,
        },
        select: {
          id: true,
          household: {
            select: {
              numCars: true,
              numMotorbike: true,
              _count: {
                select: {
                  resident: {
                    where: {
                      residentStatus: {
                        in: [
                          ResidenceStatus.NORMAL,
                          ResidenceStatus.TEMP_RESIDENT,
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      // 4️⃣ Update lại amountDue
      await Promise.all(
        assignments.map(async a => {
          const newAmount = await this.calculateAmount(
            updatedFee,
            a.household.numCars,
            a.household.numMotorbike,
            a.household._count.resident,
          );

          return tx.feeAssignment.update({
            where: { id: a.id },
            data: {
              amountDue: newAmount,
            },
          });
        }),
      );

      return updatedFee;
    });
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
          Payment:{
            select: {
              status: true,
            }
          }
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

  async getHouseholdPayment(feeId: number, householdId: number) {
    return this.prisma.feeAssignment.findFirstOrThrow({
      where: {
        feeId,
        householdId,
      },
      select: {
        feeId: true,
        Payment: true,
      },
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
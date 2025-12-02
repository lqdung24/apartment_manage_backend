import {BadRequestException, ForbiddenException, Injectable, UseGuards} from '@nestjs/common';
import {PrismaService} from "../../shared/prisma/prisma.service";
import {CreateResidentDto} from "./dto/create-resident.dto";
import {RelationshipToHead, ResidenceStatus} from "@prisma/client";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class ResidentService {
  constructor(private readonly prisma: PrismaService) {}

  async createResident(dto: CreateResidentDto){
    // convert string "YYYY-MM-DD" sang Date object
    const dob = new Date(dto.dateOfBirth);
    return this.prisma.resident.create({
      data: {
        ...dto,
        dateOfBirth: dob,
      },
    });
  }

  async assignHouseHold(id: number, houseHoldId: number){
    return this.prisma.resident.update({
      where: {id},
      data: {houseHoldId}
    })
  }

  async getResidentByHouseHoldId(houseHoldId: number){
    // Lấy tất cả resident có houseHoldId trùng với household.id
    return this.prisma.resident.findMany({
      where: {
        houseHoldId,
        residentStatus: {
          in: ["NORMAL", "TEMP_ABSENT"]
        }
      }
    });
  }
  async deleteResident(id: number, householdId: number){
    const res = await this.prisma.resident.findFirstOrThrow({
      where: {id}
    })
    if(res.houseHoldId != householdId ) {
      throw new ForbiddenException('You are not allow to delete this resident')
    }

    if(res!.relationshipToHead == RelationshipToHead.HEAD)
      throw new BadRequestException('The head of household cannot be deleted');

    return this.prisma.resident.delete({
      where: { id },
    });
  }
  async updateResident(id: number, householdId: number,dto: Partial<CreateResidentDto>){
    const res = await this.prisma.resident.findFirst({
      where: {id}
    })
    if(!res || res.houseHoldId != householdId)
      throw new ForbiddenException('You are not allow to update this resident')

    if(res.relationshipToHead == RelationshipToHead.HEAD || dto.relationshipToHead == RelationshipToHead.HEAD)
      throw new ForbiddenException('You can not change this relationship')

    // Chuyển đổi dateOfBirth sang Date nếu tồn tại
    let updateData: Partial<CreateResidentDto> = { ...dto };
    if (dto.dateOfBirth) {
      (updateData as any).dateOfBirth = new Date(dto.dateOfBirth);
    }
    return this.prisma.resident.update({ where: { id }, data: updateData });
  }

  async findResidentByNationalId(nationalId: string){
    return this.prisma.resident.findFirstOrThrow({
      where: {
        nationalId: nationalId
      }
    })
  }
  async getResidentInHouseholdByStatus(householdId: number, status: ResidenceStatus[]){
    return this.prisma.resident.findMany({
      where: {
        houseHoldId: householdId,
        residentStatus: {in: status}
      }
    })
  }
}

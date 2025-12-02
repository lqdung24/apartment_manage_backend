import {ForbiddenException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../shared/prisma/prisma.service";
import {RegisTempResidentDto} from "./dto/regis-temp-resident.dto";
import {RegisTempAndUpdateDto} from "./dto/regis-temp-and-update.dto";
import {ResidentService} from "../house-hold/resident.service";
import now = jest.now;
import {RegisTempAbsentDto} from "./dto/regis-temp-absent";

@Injectable()
export class RegistrationService{
  constructor(
    private readonly prisma: PrismaService
  ) {}
  async createTempResidentFirstTime(dto: RegisTempResidentDto, userId: number, householdId: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Tạo resident trong transaction
      const resident = await tx.resident.create({
        data: {
          ...dto.resident,
          houseHoldId: householdId
        }
      });

      // 2. Tạo temporaryResident
      return tx.temporaryResident.create({
        data: {
          residentId: resident.id,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          reason: dto.reason,
          address: dto.address,
          submittedUserId: userId,
          householdId: householdId,
        },
      });
    });
  }
  async createTempRegistration(dto: RegisTempAndUpdateDto, residentId: number,userId: number, householdId: number){
    return this.prisma.$transaction(async (tx)=>{
      await tx.temporaryResident.updateMany({
        where: {
          residentId,
          informationStatus: "PENDING"
        },
        data: { informationStatus: "DELETED" }
      })

      const resident = await tx.resident.update({
        where: {
          id: residentId,
        },
        data:{
          ...dto.resident,
          houseHoldId: householdId,
          residentStatus: "TEMP_RESIDENT"
        }
      })

      return tx.temporaryResident.create({
        data: {
          residentId: residentId,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          reason: dto.reason,
          address: dto.address,
          submittedUserId: userId,
          householdId: householdId,
        }
      })
    })
  }

  async getAllTempResidentByHousehold(householdId: number){
    return this.prisma.temporaryResident.findMany({
      where:{
        householdId,
        informationStatus: {not: "DELETED"}
      },
      include:{
        resident: true,
      }
    })
  }

  async deleteTempResidentRegistration(regisId: number){
    return this.prisma.$transaction( async (tx) => {
      const record = await tx.temporaryResident.update({
        where: {id: regisId},
        data: {
          informationStatus: "DELETED",
          endDate: new Date(Date.now())
        }
      })

      await tx.resident.update({
        where: {
          id: record.residentId
        },
        data: {
          residentStatus: "MOVE_OUT"
        }
      })
      return record
    })
  }

  async updateTempResidentRegistration(
    dto: Partial<RegisTempAndUpdateDto>,
    registrationId: number,
    householdId: number
  ) {
    return this.prisma.$transaction(async (tx) => {
      // Lấy bản ghi hiện tại để biết residentId
      const existing = await tx.temporaryResident.findFirstOrThrow({
        where: {
          id: registrationId,
        },
      });

      // Tách resident khỏi dto
      const { resident, ...tempResidentData } = dto;

      // Nếu có dữ liệu resident → update bảng resident
      if (resident) {
        await tx.resident.update({
          where: { id: existing.residentId, houseHoldId: householdId },
          data: resident,
        });
      }

      // Update bảng temporaryResident
      const updated = await tx.temporaryResident.update({
        where: { id: registrationId },
        data: tempResidentData,
      });

      return updated;
    });
  }
  async getTemAbsentByHouseholdId(householdId: number){
    return this.prisma.resident.findMany({
      where: {houseHoldId: householdId, residentStatus: "TEMP_ABSENT"},
      include: {
        TemporaryAbsence: {
          where: { informationStatus: { notIn: ["DELETED", "ENDED"] } },
        },
      }
    })
  }
  async createTempAbsentRegistration(dto: RegisTempAbsentDto, userId: number, householdId: number){
    return this.prisma.$transaction(async (tx) => {
      await tx.temporaryAbsence.updateMany({
        where: {id: dto.residentId, informationStatus: "PENDING"},
        data: {informationStatus: "DELETED"}
      })
      await tx.resident.update({
        where: {id: dto.residentId, houseHoldId: householdId},
        data: {residentStatus: "TEMP_ABSENT"}
      })
      return tx.temporaryAbsence.create({
        data: {
          ...dto,
          submittedUserId: userId
        }
      })
    })
  }
  async deleteTempAbsentRegistraion(registrationId: number, userId: number){
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.temporaryAbsence.findFirstOrThrow({
        where: {id: registrationId}
      })
      if(record.submittedUserId != userId){
        throw new ForbiddenException("You are't allow to delete")
      }
      if(record.informationStatus == "APPROVED")
        throw new ForbiddenException("You can't delete approved registration")

      if(record.informationStatus == "PENDING"){
        await tx.resident.update({
          where: {id: record.residentId},
          data: {residentStatus: "NORMAL"}
        })
        return tx.temporaryAbsence.delete({
          where: {id: registrationId}
        })
      }else{
        throw new ForbiddenException("You are't allow to delete")
      }
    })
  }

  async updateTempAbsentRegistraion(
    dto: Partial<RegisTempAbsentDto>,
    registrationId: number,
    userId: number
  ){
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.temporaryAbsence.findFirstOrThrow({
        where: {id: registrationId}
      })

      if(record.submittedUserId != userId){
        throw new ForbiddenException("You are't allow to update")
      }

      if(record.informationStatus == "APPROVED")
        throw new ForbiddenException("You can't update approved registration")

      if(record.informationStatus == "PENDING"){
        return tx.temporaryAbsence.update({
          where: {id: registrationId},
          data: {...dto}
        })
      }else{
        throw new ForbiddenException("You are't allow to update")
      }
    })
  }
}
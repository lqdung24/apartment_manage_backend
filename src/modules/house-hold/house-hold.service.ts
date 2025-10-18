import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../shared/prisma/prisma.service";
import {ResidentService} from "../resident/resident.service";
import {CreateHouseHoldAndHeadDto} from "./dto/create-house-hold-and-head.dto";
import {HouseHoldStatus, RelationshipToHead} from "@prisma/client";
import {CreateResidentDto} from "../resident/dto/create-resident.dto";


@Injectable()
export class HouseHoldService {
  constructor(private readonly prisma: PrismaService,
              private readonly residentService: ResidentService) {}

  async createHouseHoldWithUserAndResident(userId: number, dto: CreateHouseHoldAndHeadDto) {
    //flow: tạo resident -> household (với user và resident đã tạo)
    // liên kết resident với house hold
    const resident = await this.residentService.createResident(dto.resident);

    const conflict = await this.prisma.houseHolds.findFirst({
      where: {
        OR: [
          {houseHoldCode: dto.household.houseHoldCode},
          {apartmentNumber: dto.household.apartmentNumber},
          {headID: resident.id},
          {userID: userId}
        ]
      }
    })

    if (conflict) {
      const conflicts: string[] = [];

      if (dto.household.houseHoldCode === conflict.houseHoldCode)
        conflicts.push("houseHoldCode");
      if (dto.household.apartmentNumber === conflict.apartmentNumber)
        conflicts.push("apartmentNumber");
      if (resident.id === conflict.headID)
        conflicts.push("headID");
      if (userId === conflict.userID)
        conflicts.push("userID");

      throw new ConflictException(`${conflicts.join(", ")} already exist`);
    }

    const household = await this.prisma.houseHolds.create({
      data: {
        houseHoldCode: dto.household.houseHoldCode,
        apartmentNumber: dto.household.apartmentNumber,
        buildingNumber: dto.household.buildingNumber,
        street: dto.household.street,
        ward: dto.household.ward,
        province: dto.household.province,
        status: HouseHoldStatus.ACTIVE,
        account: { connect: { id: userId } },  // connect user
        head: { connect: { id: resident.id } }, // connect resident chủ hộ
      },
    });

    await this.residentService.assignHouseHold(resident.id, household.id);
    resident.houseHoldId = household.id;

    return { household, resident }
  }
  async getHouseHoldByUserId(userId: number){
    const household = await this.prisma.houseHolds.findFirst({
      where: {
        userID: userId
      }
    });
    return household;
  }

  async addHouseMember(userId: number, dto: CreateResidentDto){
    const household = await this.prisma.houseHolds.findFirst({where: { userID: userId }})
    if(!household)
      throw new NotFoundException("Household with this userId not found")
    if(household.headID && dto.relationshipToHead == RelationshipToHead.HEAD)
      throw new ConflictException("This Household already has head")
    dto.houseHoldId = household.id;
    return this.residentService.createResident(dto);
  }
}

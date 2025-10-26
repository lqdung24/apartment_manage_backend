import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../shared/prisma/prisma.service";
import {CreateHouseHoldAndHeadDto} from "./dto/create-house-hold-and-head.dto";
import {HouseHoldStatus, RelationshipToHead} from "@prisma/client";
import {CreateResidentDto} from "./dto/create-resident.dto";
import {UserService} from "../user/user.service";
import {ResidentService} from "./resident.service";

@Injectable()
export class HouseHoldService {
  constructor(private readonly prisma: PrismaService,
              private readonly residentService: ResidentService,
              private readonly userService: UserService
  ) {}

  async createWithUserAndResident(userId: number, dto: CreateHouseHoldAndHeadDto) {
    //flow: tạo resident -> household (với user và resident đã tạo)
    // liên kết resident với house hold
    const resident = await this.residentService.createResident(dto.resident);

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
    await this.userService.updateHouseholdId(userId, household.id)
    await this.residentService.assignHouseHold(resident.id, household.id);
    resident.houseHoldId = household.id;

    return { household, resident }
  }

  async addHouseMember(householdId: number, dto: CreateResidentDto){
    const household = await this.prisma.houseHolds.findFirst({
      where: { id: householdId }
    })
    if(!household)
      throw new NotFoundException("Household with this id not found")
    if(household.headID && dto.relationshipToHead == RelationshipToHead.HEAD)
      throw new ConflictException("This Household already has head")
    dto.houseHoldId = householdId;
    return this.residentService.createResident(dto);
  }
  async getAllMember(householdId: number){
    return this.residentService.getResidentByHouseHoldId(householdId)
  }
  async deleteMember(householdId: number, residentId: number) {
    // chỉ cho phép xóa thành viên trong hộ của mình
    return this.residentService.deleteResident(residentId, householdId);
  }
  async updateMember(householdId: number, residentId: number, dto: Partial<CreateResidentDto>){
    const household = await this.prisma.houseHolds.findFirst({
      where: { id: householdId }
    })
    if(!household)
      throw new NotFoundException("Household with this id not found")

    if(household.headID && dto.relationshipToHead == RelationshipToHead.HEAD)
      throw new ConflictException("This Household already has head")

    return this.residentService.updateResident(residentId, householdId, dto);
  }
}

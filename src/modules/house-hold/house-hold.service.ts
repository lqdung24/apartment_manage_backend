import {ConflictException, ForbiddenException, Head, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../../shared/prisma/prisma.service";
import {CreateHouseHoldAndHeadDto} from "./dto/create-house-hold-and-head.dto";
import {HouseHoldStatus, RelationshipToHead} from "@prisma/client";
import {CreateResidentDto} from "./dto/create-resident.dto";
import {UserService} from "../user/user.service";
import {ResidentService} from "./resident.service";
import {CreateHouseHoldDto} from "./dto/create-house-hold.dto";
import { AdminGateway } from 'src/websocket/admin.gateway';

@Injectable()
export class HouseHoldService {
  constructor(private readonly prisma: PrismaService,
              private readonly residentService: ResidentService,
              private readonly userService: UserService,
              private readonly adminGateway: AdminGateway
  ) {}

  async createWithUserAndResident(userId: number, dto: CreateHouseHoldAndHeadDto) {
    //flow: tạo resident -> household (với user và resident đã tạo)
    // liên kết resident với house hold
    dto.resident.relationshipToHead = RelationshipToHead.HEAD
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

    this.adminGateway.notifyHouseholdUpdated({
      action: 'create',
      household,
      resident,
    });

    return { household, resident }
  }

  async addHouseMember(householdId: number, dto: CreateResidentDto){
    const household = await this.prisma.houseHolds.findFirst({
      where: { id: householdId }
    })
    if(!household)
      throw new NotFoundException(`Household with id ${householdId} not found`)

    if(household.headID && dto.relationshipToHead == RelationshipToHead.HEAD)
      throw new ConflictException("This Household already has head")
    dto.houseHoldId = householdId;
    const newMember = await this.residentService.createResident(dto);
    this.adminGateway.notifyHouseholdUpdated({
      action:'add_member',
      householdId,
      resident: newMember,
    })
    return newMember;
  }
  async getAllMember(householdId: number){
    return this.residentService.getResidentByHouseHoldId(householdId)
  }
  async deleteMember(residentId: number, householdId: number) {
    const deleted = await this.residentService.deleteResident(residentId, householdId);

    this.adminGateway.notifyHouseholdUpdated({
      action: 'delete_member',
      householdId,
      residentId,
    });

    return deleted;
  }
  async updateMember(residentId: number, householdId: number, dto: Partial<CreateResidentDto>){
    const updated = await this.residentService.updateResident(residentId, householdId, dto);
    this.adminGateway.notifyHouseholdUpdated({
      action: 'update_member',
      householdId,
      resident: updated,
    });

    return updated;
  }

  async getHouseholdId(userID:number){
    // return this.prisma.houseHolds.findFirstOrThrow({
    //   where: {userID}
    // })
    const household = await this.prisma.houseHolds.findFirstOrThrow({
      where: {userID}
    })
    const head = await this.prisma.resident.findFirstOrThrow({
      where: {id: (household).headID}
    })
    return {household, head}
  }

  async updateHousehold(id: number, data: Partial<CreateHouseHoldDto>){
    const oldHousehold = await this.prisma.houseHolds.findFirstOrThrow({
      where:{id}
    })
    //data.headID = Number(data.headID)
     if (data.headID !== undefined && data.headID !== null) {
        data.headID = Number(data.headID);

    // nếu headID không hợp lệ => bỏ qua
        if (isNaN(data.headID)) {
          delete data.headID;
        }
    }
    //neu update chu ho
    if(data.headID != undefined && oldHousehold.headID != data.headID){
      // data.headID = +data.headID
      const resident = await this.prisma.resident.findFirstOrThrow({
        where: {id: data.headID}
      })

      if(resident.houseHoldId != id){
        throw new ForbiddenException("This residence is not in this household")
      }
      // resident hien tai thanh other
      await this.prisma.resident.update({
        where: {id: oldHousehold.headID},
        data: {relationshipToHead: RelationshipToHead.OTHER}
      })

      const newHead = await this.prisma.resident.update({
        where: {id: data.headID},
        data:{relationshipToHead: RelationshipToHead.HEAD}
      })
    }
    const updateHousehold = await this.prisma.houseHolds.update({
      where: {id},
      data: data
    })

    this.adminGateway.notifyHouseholdUpdated({
      action:'update',
      household: updateHousehold,
    });
    return updateHousehold
  }
}

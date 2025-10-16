import {ConflictException, Injectable} from '@nestjs/common';
import {PrismaService} from "../../shared/prisma/prisma.service";
import {CreateResidentDto} from "./dto/create-resident.dto";

@Injectable()
export class ResidentService {
  constructor(private readonly prisma: PrismaService) {}

  async createResident(dto: CreateResidentDto){
    const conflict = await this.prisma.resident.findFirst({
      where: {
        OR: [
          {nationalId: dto.nationalId},
          {phoneNumber: dto.phoneNumber},
          {email: dto.email}
        ]
      }
    });

    if (conflict) {
      const conflicts: string[] = [];

      if (dto.nationalId === conflict.nationalId)
        conflicts.push("nationalId");
      if (dto.email === conflict.email)
        conflicts.push("email");
      if (dto.phoneNumber === conflict.phoneNumber)
        conflicts.push("phoneNumber");

      throw new ConflictException(`${conflicts.join(", ")} already exist`);
    }

    // convert string "YYYY-MM-DD" sang Date object
    const dob = new Date(dto.dateOfBirth);

    const resident = await this.prisma.resident.create({
      data: {
        ...dto,
        dateOfBirth: dob,
      },
    });

    return resident;
  }

  assignHouseHold(id: number, houseHoldId: number){
    this.prisma.resident.findFirstOrThrow({
      where: {id}
    })

    return this.prisma.resident.update({
      where: {id},
      data: {houseHoldId}
    })
  }
}

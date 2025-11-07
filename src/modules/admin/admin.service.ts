import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService ){}
    async getAllHouseholds() {
    return this.prisma.houseHolds.findMany({
      include: {
        // head: true,
        resident: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async getHouseholdDetail(id: number) {
    const household = await this.prisma.houseHolds.findUniqueOrThrow({
      where: { id },
      include: {
        // head: true,
        // account: { select: { id: true, email: true, role: true } },
        resident: true,
      },
    });
    return household;
  }
}

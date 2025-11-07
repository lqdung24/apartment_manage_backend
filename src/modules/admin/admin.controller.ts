import { AdminService } from './admin.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorater';
import { RolesGuard } from 'src/common/guards/roles.guard';
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Roles('ADMIN')
  getAllHouseholds() {
    return this.adminService.getAllHouseholds();
  }

  @Get(':id')
  @Roles('ADMIN')
  getHouseholdDetail(@Param('id') id: string) {
    return this.adminService.getHouseholdDetail(Number(id));
  }
}

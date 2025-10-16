import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorater';
import { Role } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() data: CreateUserDto) {
  //   return this.userService.create(data);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }
  //
  // @Get(':id')
  // findById(@Param('id', ParseIntPipe) id: number) {
  //   return this.userService.findById(id);
  // }
  //
  // @Patch(':id')
  // updateById(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() data: UpdateUserDto,
  // ) {
  //   return this.userService.updateById(id, data);
  // }
  //
  // @Delete(':id')
  // removeById(@Param('id', ParseIntPipe) id: number) {
  //   return this.userService.removeById(id);
  // }

  @Patch(':id/update-role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserRoleDto) {
    return this.userService.updateRole(id, dto);
  }
}

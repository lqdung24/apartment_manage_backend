import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req} from '@nestjs/common';
import { HouseHoldService } from './house-hold.service';
import {AuthGuard} from "@nestjs/passport";
import {CreateHouseHoldAndHeadDto} from "./dto/create-house-hold-and-head.dto";
import {CreateResidentDto} from "./dto/create-resident.dto";

@Controller('house-hold')
export class HouseHoldController {
  constructor(private readonly houseHoldService: HouseHoldService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req,@Body() dto: CreateHouseHoldAndHeadDto) {
    return this.houseHoldService.createWithUserAndResident(req.user.id, dto);
  }

  @Post('addmember')
  @UseGuards(AuthGuard('jwt'))
  addHouseMember(@Req() req, @Body() dto: CreateResidentDto){
    return this.houseHoldService.addHouseMember(req.user.id, dto);
  }
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getHouseHold(@Req() req){
    return req.user.houseHoldId
  }
  @Get('member')
  @UseGuards(AuthGuard('jwt'))
  getResidentByHouseHoldId(@Req() req){
    return this.houseHoldService.getAllMember(req.user.houseHoldId);
  }

  @Patch('member/:residentId')
  @UseGuards(AuthGuard('jwt'))
  updateHouseMember(
    @Req() req,
    @Param('residentId') residentId: string,
    @Body() dto: Partial<CreateResidentDto>
  ) {
    return this.houseHoldService.updateMember(req.user.id, Number(residentId), dto);
  }

  @Delete('member/:residentId')
  @UseGuards(AuthGuard('jwt'))
  deleteHouseMember(@Req() req, @Param('residentId') residentId: string) {
    return this.houseHoldService.deleteMember(req.user.householdId, Number(residentId));
  }
}

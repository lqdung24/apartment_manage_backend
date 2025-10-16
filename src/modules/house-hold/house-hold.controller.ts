import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req} from '@nestjs/common';
import { HouseHoldService } from './house-hold.service';
import {AuthGuard} from "@nestjs/passport";
import {CreateHouseHoldAndHeadDto} from "./dto/create-house-hold-and-head.dto";

@Controller('house-hold')
export class HouseHoldController {
  constructor(private readonly houseHoldService: HouseHoldService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() req,@Body() dto: CreateHouseHoldAndHeadDto) {
    return this.houseHoldService.createHouseHoldWithUserAndResident(req.user.id, dto);
  }
}

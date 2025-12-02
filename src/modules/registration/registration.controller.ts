import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from "@nestjs/common";
import {RegistrationService} from "./registration.service";
import {AuthGuard} from "@nestjs/passport";
import {RegisTempResidentDto} from "./dto/regis-temp-resident.dto";
import {RegisTempAndUpdateDto} from "./dto/regis-temp-and-update.dto";
import {RegisTempAbsentDto} from "./dto/regis-temp-absent";
import {CarriageReturnLineFeed} from "ts-loader/dist/constants";

@Controller('registration')
export class RegistrationController{
  constructor(private readonly registrationService: RegistrationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('tem-resident')
  async getAllTempResidentByHousehold(@Req() req){
    return this.registrationService.getAllTempResidentByHousehold(req.householdId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('tem-resident-firsttime')
  async createTempResident(@Req() req, @Body() dto: RegisTempResidentDto){
    return this.registrationService.createTempResidentFirstTime(dto, req.user.id, req.user.householdId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('tem-resident/:residentId')
  async createTempRegistration(@Req() req, @Param('residentId') residentId,@Body() dto: RegisTempAndUpdateDto){
    return this.registrationService.createTempRegistration(dto, Number(residentId), req.user.id, req.user.householdId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('tem-resident/:registrationId')
  async deleteTempRegistration(@Req() req, @Param('registrationId') registrationId: string){
    return this.registrationService.deleteTempResidentRegistration(Number(registrationId))
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('tem-resident/:registraionId')
  async updateTempResidentRegistration(
    @Req() req,
    @Param('registraionId') registraionId: string,
    @Body() dto: Partial<RegisTempAndUpdateDto>
  ){
    return this.registrationService.updateTempResidentRegistration(
      dto, Number(registraionId),
      req.user.householdId
    )
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('tem-absent')
  async getTemAbsentByHouseholdId(@Req() req){
    return this.registrationService.getTemAbsentByHouseholdId(req.user.householdId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('tem-absent')
  async createTempAbsentRegistraion(
    @Req() req,
    @Body() dto: RegisTempAbsentDto
  ){
    return this.registrationService.createTempAbsentRegistration(dto, req.user.id, req.user.householdId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('tem-absent/:registrationId')
  async deleteTempAbsentRegistraion(
    @Req() req,
    @Param('registrationId') registrationId: string
  ){
    return this.registrationService
      .deleteTempAbsentRegistraion(Number(registrationId), req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('tem-absent/:registrationId')
  async updateTempAbsentRegistraion(
    @Req() req,
    @Param('registrationId') registrationId: string,
    @Body() dto: Partial<RegisTempAbsentDto>
  ){
    return this.registrationService
      .updateTempAbsentRegistraion(dto, Number(registrationId), req.user.id);
  }
}

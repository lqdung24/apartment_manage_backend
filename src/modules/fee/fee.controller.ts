import { Body, Controller, Get, Post, Patch, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { FeeService } from './fee.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { CreateFeeAssignmentDto } from './dto/create-assignment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorater';
import { RolesGuard } from 'src/common/guards/roles.guard';


@Controller('fee')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles ('ADMIN')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}
 
  @Post()
  create(@Body() createFeeDto: CreateFeeDto) {
    return this.feeService.create(createFeeDto);
  }

  @Get()
  findAll() {
    return this.feeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
      return this.feeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateFeeDto>) {
    return this.feeService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feeService.remove(Number(id));
  }

  @Post('assign')
  assign(@Body() dto: CreateFeeAssignmentDto) {
    return this.feeService.assignFee(dto);
  }

  @Get(':id/detail')
  detail(@Param('id') id: string) {
    return this.feeService.getFeeDetail(Number(id));
  }

  @Get('household/:id')
  getHouseholdFees(@Param('id') id: string) {
    return this.feeService.getFeesOfHousehold(Number(id));
  }

  @Get('household/:id/paid')
  getPaid(@Param('id') id: string) {
    return this.feeService.getPaidFees(Number(id));
  }

  @Get('household/:id/unpaid')
  getUnpaid(@Param('id') id: string) {
    return this.feeService.getUnpaidFees(Number(id));
  }

}

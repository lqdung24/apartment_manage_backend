import { Body, Controller, Get, Post, Patch, Delete, Param, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { FeeService } from './fee.service';
import { CreateFeeDto } from './dto/create-fee.dto';
import { CreateFeeAssignmentDto } from './dto/create-assignment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorater';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('fee')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Roles ('ADMIN')
  @Post()
  create(@Body() createFeeDto: CreateFeeDto) {
    return this.feeService.create(createFeeDto);
  }

  @Roles ('ADMIN')
  @Post('assign')
  assign(@Body() dto: CreateFeeAssignmentDto) {
    return this.feeService.assignFee(dto);
  }
  
  @Get(':id/detail')
  detail(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isPaid') isPaid?: string, 
  ) {
    return this.feeService.getFeeDetail(id, { 
      page, 
      limit, 
      isPaid 
    });
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

  @Roles ('ADMIN')
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.feeService.findAll({
      page: page? Number(page) : 1,
      limit: limit ? Number(limit) : 5,
      search,
    });
  }

  @Roles ('ADMIN')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
      return this.feeService.findOne(id);
  }

  @Roles ('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateFeeDto>) {
    return this.feeService.update(Number(id), dto);
  }

  @Roles ('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feeService.remove(Number(id));
  }

}

import {Body, Controller, Post} from '@nestjs/common';
import { ResidentService } from './resident.service';
import {CreateResidentDto} from "./dto/create-resident.dto";

@Controller('resident')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  @Post()
  createResident(@Body() dto: CreateResidentDto){
    return this.residentService.createResident(dto);
  }
}

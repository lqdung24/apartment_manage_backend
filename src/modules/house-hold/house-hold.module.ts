import { Module } from '@nestjs/common';
import { HouseHoldService } from './house-hold.service';
import { HouseHoldController } from './house-hold.controller';
import {UserModule} from "../user/user.module";
import {ResidentService} from "./resident.service";

@Module({
  controllers: [HouseHoldController],
  providers: [HouseHoldService, ResidentService],
  imports: [UserModule],
})
export class HouseHoldModule {}

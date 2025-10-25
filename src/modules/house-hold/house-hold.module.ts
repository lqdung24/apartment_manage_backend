import { Module } from '@nestjs/common';
import { HouseHoldService } from './house-hold.service';
import { HouseHoldController } from './house-hold.controller';
import {ResidentService} from "../resident/resident.service";
import {ResidentModule} from "../resident/resident.module";
import {UserService} from "../user/user.service";
import {UserModule} from "../user/user.module";

@Module({
  controllers: [HouseHoldController],
  providers: [HouseHoldService],
  imports: [ResidentModule, UserModule],
})
export class HouseHoldModule {}

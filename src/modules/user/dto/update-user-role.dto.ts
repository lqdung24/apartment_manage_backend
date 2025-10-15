import {IsEnum, IsNotEmpty} from "class-validator";
import {Role} from "@prisma/client";

export class UpdateUserRoleDto{
  @IsEnum(Role, {message: 'Role not exist'})
  @IsNotEmpty()
  role: Role
}
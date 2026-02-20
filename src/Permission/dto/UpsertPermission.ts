import { IsOptional, IsString } from "class-validator";
import { PermissionActionEnum } from "../enum/PermissionActionEnum";
import { PermissionModuleEnum } from "../enum/PermissionModuleEnum";

export class UpsertPermissionDto {
    @IsString()
    @IsOptional()
    Id?: string;

    @IsString()
    @IsOptional()
    PermissionAction?: PermissionActionEnum;

    @IsString()
    @IsOptional()
    Module?: PermissionModuleEnum;

    @IsString()
    @IsOptional()
    Description?: string;
}

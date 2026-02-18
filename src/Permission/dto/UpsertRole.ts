import { IsOptional, IsString } from "class-validator";

export class UpsertRoleDto {
    @IsString()
    @IsOptional()
    RoleId?: string;

    @IsString()
    @IsOptional()
    RoleName?: string;

    @IsString()
    @IsOptional()
    Description?: string;
}

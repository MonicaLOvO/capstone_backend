import { IsArray, IsOptional, IsString } from "class-validator";

export class UpsertRolePermissionDto {
    @IsString()
    RoleId!: string;

    @IsString()
    @IsOptional()
    PermissionId?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    PermissionIds?: string[];
}

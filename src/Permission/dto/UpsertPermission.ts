import { IsOptional, IsString } from "class-validator";

export class UpsertPermissionDto {
    @IsString()
    @IsOptional()
    PermissionId?: string;

    @IsString()
    @IsOptional()
    PermissionName?: string;

    @IsString()
    @IsOptional()
    Module?: string;

    @IsString()
    @IsOptional()
    Description?: string;
}

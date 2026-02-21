import { IsOptional, IsString } from "class-validator";

export class UpsertRoleDto {
    @IsString()
    @IsOptional()
    Id?: string;

    @IsString()
    @IsOptional()
    RoleName?: string;

    @IsString()
    @IsOptional()
    Description?: string;
}

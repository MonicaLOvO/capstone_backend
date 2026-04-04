import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpsertDepartmentDto {
    @IsString()
    @IsOptional()
    Id?: string;

    @IsString()
    @IsOptional()
    DepartmentName?: string;

    @IsString()
    @IsOptional()
    Description?: string;

    @IsBoolean()
    @IsOptional()
    IsActive?: boolean;
}

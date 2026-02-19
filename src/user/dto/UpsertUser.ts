import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpsertUserDto {
    @IsString()
    @IsOptional()
    UserId?: string;

    @IsString()
    @IsOptional()
    Username?: string;

    @IsString()
    @IsOptional()
    Email?: string;

    @IsString()
    @IsOptional()
    Password?: string;

    @IsString()
    @IsOptional()
    FirstName?: string;

    @IsString()
    @IsOptional()
    LastName?: string;

    @IsString()
    @IsOptional()
    DepartmentId?: string;

    @IsString()
    @IsOptional()
    RoleId?: string;

    @IsBoolean()
    @IsOptional()
    IsActive?: boolean;
}

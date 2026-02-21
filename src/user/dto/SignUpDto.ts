import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class SignUpDto {
    @IsString()
    Username!: string;

    @IsEmail()
    Email!: string;

    @IsString()
    @MinLength(6)
    Password!: string;

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
}

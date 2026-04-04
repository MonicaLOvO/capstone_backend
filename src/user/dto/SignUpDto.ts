import { IsEmail, IsOptional, IsString, MinLength, Equals, IsNotEmpty } from "class-validator";
import { IsRealEmailDomain } from "../../validator/IsRealEmailDomain.decorator";

export class SignUpDto {
  @IsString()
  Username!: string;

  @IsEmail()
  @IsRealEmailDomain({ message: "Email domain cannot receive email" })
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

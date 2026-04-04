import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import { EmployeeReportTypeEnum } from "../enum/employeeReportEnum";

export class UpsertEmployeeReportDto {
  @IsUUID()
  @IsOptional()
  Id?: string;

  @IsUUID()
  @IsOptional()
  @MaxLength(255)
  @MinLength(2)
  employeeId?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @MinLength(1)
  @IsOptional()
  employeeName?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  department?: string;

  @IsEnum(EmployeeReportTypeEnum, {
    message: "reportType must be a valid EmployeeReportTypeEnum value",
  })
  @IsOptional()
  reportType?: EmployeeReportTypeEnum;

  @IsDateString({}, { message: "reportDate must be a valid ISO date string" })
  @IsOptional()
  reportDate?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  reportedBy?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  previousWarnings?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  additionalNotes?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  actionTaken?: string;
}

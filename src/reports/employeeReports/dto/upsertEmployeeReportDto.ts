import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { EmployeeReportTypeEnum } from "../enum/employeeReportEnum";

export class UpsertEmployeeReportDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsOptional()
  employeeName?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEnum(EmployeeReportTypeEnum)
  @IsOptional()
  reportType?: EmployeeReportTypeEnum;

  @IsDateString()
  @IsOptional()
  reportDate?: string;

  @IsString()
  @IsOptional()
  reportedBy?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  previousWarnings?: string;

  @IsString()
  @IsOptional()
  additionalNotes?: string;

  @IsString()
  @IsOptional()
  actionTaken?: string;
}

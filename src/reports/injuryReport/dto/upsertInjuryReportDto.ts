import { IsDateString, IsString, IsOptional } from "class-validator";

export class UpsertInjuryReportDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  employeeName?: string;

  @IsString()
  @IsOptional()
  reportedBy?: string;

  @IsString()
  @IsOptional()
  injuryType?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  additionalNotes?: string;

  @IsDateString()
  @IsOptional()
  reportDate?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  witnesses?: string;
}
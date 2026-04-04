import { IsDateString, IsString, IsOptional, MaxLength  } from "class-validator";

export class UpsertInjuryReportDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  employeeName?: string;
  

  @IsString()
  @IsOptional()
  @MaxLength(100)
  reportedBy?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)

  injuryType?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  additionalNotes?: string;

  @IsDateString()
  @IsOptional()
  reportDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  witnesses?: string;
}
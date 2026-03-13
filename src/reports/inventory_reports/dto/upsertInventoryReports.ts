import { IsEnum, IsOptional, IsString } from "class-validator";
import { InventoryReportType } from "../enum/inventoryReportEnum";


export class UpsertInventoryReportDto {
    @IsString()
    Id?: string;

    @IsString()
    @IsOptional()
    ItemName?: string;

    @IsString()
    @IsOptional()
    reportedBy?: string;

    @IsEnum(InventoryReportType)
    @IsOptional()
    ReportType?: InventoryReportType;

    @IsString()
    @IsOptional()
    Description?: string;

    @IsString()
    @IsOptional()
    AdditionalNotes?: string;

    @IsEnum(InventoryReportType)
    @IsOptional()
    ReportTypeEnum?: InventoryReportType;

}
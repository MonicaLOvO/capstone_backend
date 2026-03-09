import { InventoryReportType } from "../enum/inventoryReportEnum";

export class InventoryReportModel {
    Id!: string;
    ItemName?: string;
    reportedBy?: string;
    ReportType?: InventoryReportType;
    Description?: string;
    AdditionalNotes?: string;

}


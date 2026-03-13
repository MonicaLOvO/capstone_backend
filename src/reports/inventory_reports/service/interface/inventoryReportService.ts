import { InventoryReportModel } from "../../model/inventoryReportModel";
import { UpsertInventoryReportDto } from "../../dto/upsertInventoryReports";

export abstract class IInventoryReportService {
  abstract GetInventoryReports(
    query?: Record<string, string>
  ): Promise<[InventoryReportModel[], number]>;
  abstract GetInventoryReportById(id: string): Promise<InventoryReportModel | null>;
  abstract CreateInventoryReport(dto: UpsertInventoryReportDto): Promise<string>;
  abstract UpdateInventoryReport(dto: UpsertInventoryReportDto): Promise<string>;
  abstract DeleteInventoryReport(id: string): Promise<string>;
}
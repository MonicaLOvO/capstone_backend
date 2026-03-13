import { injectable } from "tsyringe";
import { InventoryReportsItem } from "../../../entity/inventoryReportsItem";
import { InventoryReportModel } from "../../../model/inventoryReportModel";
import { IInventoryReportMapperService } from "../../interface/mapper/inventoryReportMapperService";

export { IInventoryReportMapperService };

@injectable()
export class InventoryReportMapperService implements IInventoryReportMapperService {
  MapEntityToModel(entity: InventoryReportsItem): InventoryReportModel {
    const model: InventoryReportModel = {
      Id: entity.Id,
      ItemName: entity.ItemName,
      reportedBy: entity.reportedBy,
      ReportType: entity.ReportType,
      Description: entity.Description,
      AdditionalNotes: entity.AdditionalNotes ?? "",
    };
    return model;
  }
}
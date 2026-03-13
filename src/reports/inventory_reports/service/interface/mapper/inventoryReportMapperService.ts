import { InventoryReportsItem } from "../../../entity/inventoryReportsItem";
import { InventoryReportModel } from "../../../model/inventoryReportModel";

export abstract class IInventoryReportMapperService {
    abstract MapEntityToModel(entity: InventoryReportsItem): InventoryReportModel;
}
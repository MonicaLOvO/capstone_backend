import { InventoryItem } from "../../../entity/Inventory-item";
import { InventoryItemModel } from "../../../model/InventoryItemModel";

export abstract class IInventoryItemMapperService {
    abstract MapEntityToModle(entity: InventoryItem): InventoryItemModel;
}
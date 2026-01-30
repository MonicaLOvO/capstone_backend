import { InventoryItem } from "../../../entity/Inventory-item";
import { InventoryItemModel } from "../../../model/InventoryItemModel";


export interface IInventoryItemMapperService {
    MapEntityToModle(entity: InventoryItem): InventoryItemModel;
}
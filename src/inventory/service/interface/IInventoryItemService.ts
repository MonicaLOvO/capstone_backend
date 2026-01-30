import { InventoryItemModel } from "../../model/InventoryItemModel";

export interface IInventoryItemService {
    GetInventoryItems(): Promise<InventoryItemModel[]>;
}

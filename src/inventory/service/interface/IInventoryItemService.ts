import { InventoryItemModel } from "../../model/InventoryItemModel";

export abstract class IInventoryItemService {
    abstract GetInventoryItems(): Promise<InventoryItemModel[]>;
    abstract GetInventoryItemById(id: string): Promise<InventoryItemModel | null>;
}

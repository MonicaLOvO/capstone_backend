import { UpsertInventoryItemDto } from "../../dto/UpsertInventoryItem";
import { InventoryItemModel } from "../../model/InventoryItemModel";

export abstract class IInventoryItemService {
    abstract GetInventoryItems(query?: Record<string, string>): Promise<[InventoryItemModel[], number]>;
    abstract GetInventoryItemById(id: string): Promise<InventoryItemModel | null>;
    abstract CreateInventoryItem(dto: UpsertInventoryItemDto): Promise<string>;
    abstract UpdateInventoryItem(dto: UpsertInventoryItemDto): Promise<string>;
    abstract DeleteInventoryItem(id: string): Promise<string>;
}

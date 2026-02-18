import { UpsertInventoryItemDto } from "../../dto/UpsertInventoryItem";
import { InventoryItemModel } from "../../model/InventoryItemModel";
import { InventoryItemSummaryModel } from "../../model/InventoryItemSummaryModel";

export abstract class IInventoryItemService {
    abstract GetInventoryItems(query?: Record<string, string>): Promise<[InventoryItemModel[], number]>;
    abstract GetInventoryItemById(id: string): Promise<InventoryItemModel | null>;
    abstract GetInventoryItemsByProductName(productName: string): Promise<InventoryItemSummaryModel>;
    abstract CreateInventoryItem(dto: UpsertInventoryItemDto): Promise<string>;
    abstract UpdateInventoryItem(dto: UpsertInventoryItemDto): Promise<string>;
    abstract DeleteInventoryItem(id: string): Promise<string>;
}

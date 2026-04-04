import { InventoryItemModel } from "./InventoryItemModel";

export class InventoryItemSummaryModel {
    Items!: InventoryItemModel[];
    TotalPrice!: number;
    TotalStock!: number;
}

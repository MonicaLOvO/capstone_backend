import { InventoryItemStatusEnum } from "../enum/InventoryItemStatusEnum";

export class InventoryItemModel {
    Id!: string;
    ProductName?: string;
    Description?: string;
    Quantity?: number;
    UnitPrice?: number;
    QrCodeValue?: string;
    ImageUrl?: string;
    Category?: string;
    Location?: string;
    Sku?: string;
    Status?: InventoryItemStatusEnum;
}
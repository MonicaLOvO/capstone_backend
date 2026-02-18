import { InventoryItemStatusEnum } from "../enum/InventoryItemStatusEnum";
import { OrderItemModel } from "../../order/model/OrderItemModel";

export class InventoryItemModel {
    Id!: string;
    ProductName?: string;
    Description?: string;
    Quantity?: number;
    UnitPrice?: number;
    ImageUrl?: string;
    Category?: string;
    Location?: string;
    Sku?: string;
    Status?: InventoryItemStatusEnum;
    OrderItems?: OrderItemModel[];
    LowestStockLevel?: number;
}
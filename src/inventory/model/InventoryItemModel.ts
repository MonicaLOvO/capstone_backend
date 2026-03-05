import { InventoryItemStatusEnum } from "../enum/InventoryItemStatusEnum";
import { OrderItemModel } from "../../order/model/OrderItemModel";
import { MediaModel } from "../../media/model/MediaModel";

export class InventoryItemModel {
    Id!: string;
    ProductName?: string;
    Description?: string;
    Quantity?: number;
    UnitPrice?: number;
    MediaAssets?: MediaModel[];
    Category?: string;
    Location?: string;
    Sku?: string;
    Status?: InventoryItemStatusEnum;
    OrderItems?: OrderItemModel[];
    LowestStockLevel?: number;
}
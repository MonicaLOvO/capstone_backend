import { InventoryItemStatusEnum } from "../enum/InventoryItemStatusEnum";
import { OrderItem } from "../../order/entity/OrderItem";

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
    OrdersId?: OrderItem[];
}
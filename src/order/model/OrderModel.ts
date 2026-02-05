import { OrderItemModel } from "./OrderItemModel";
import { OrderStatusEnum } from "../enum/OrderStatusEnum";

export class OrderModel {
    Id!: string;
    OrderType?: string;
    OrderDate?: Date;
    OrderStatus?: OrderStatusEnum;
    OrderCompletedDate?: Date;
    OrderItems?: OrderItemModel[];
    TotalPrice?: number;
    
}

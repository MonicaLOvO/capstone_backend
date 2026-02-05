import { OrderItem } from "../entity/OrderItem";
import { OrderStatusEnum } from "../enum/OrderStatusEnum";

export class OrderModel {
    Id!: string;
    OrderType?: string;
    OrderDate?: Date;
    OrderStatus?: OrderStatusEnum;
    OrderCompletedDate?: Date;
    OrderItemsId?: OrderItem[];
    TotalPrice?: number;
}

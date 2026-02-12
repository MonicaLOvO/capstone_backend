import { UpsertOrderItemDto } from "../../dto/UpsertOrderItemDto";
import { OrderItemModel } from "../../model/OrderItemModel";

export abstract class IOrderItemService {
    abstract GetOrderItemsByOrderId(orderId: string, query?: Record<string, string>): Promise<[OrderItemModel[], number]>;
    abstract GetOrderItemById(id: string): Promise<OrderItemModel | null>;
    abstract CreateOrderItem(dto: UpsertOrderItemDto): Promise<string>;
    abstract UpdateOrderItem(dto: UpsertOrderItemDto): Promise<string>;
    abstract DeleteOrderItem(id: string): Promise<string>;
}

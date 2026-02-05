import { OrderModel } from "../../model/OrderModel";
import { OrderDto } from "../../dto/OrderDto";

export abstract class IOrderService {
    abstract GetOrders(query?: Record<string, string>): Promise<[OrderModel[], number]>;
    abstract GetOrderById(id: string): Promise<OrderModel>;
    abstract CreateOrder(dto: OrderDto): Promise<string>;
    abstract UpdateOrder(dto: OrderDto): Promise<string>;
    abstract DeleteOrder(id: string): Promise<string>;

}
import { Order } from "../../../entity/Order";
import { OrderItem } from "../../../entity/OrderItem";
import { OrderItemModel } from "../../../model/OrderItemModel";
import { OrderModel } from "../../../model/OrderModel";

export abstract class IOrderMapperService {
    abstract MapEntityToModel(entity: Order): OrderModel;
    abstract MapEntityToOrderItemModel(entity: OrderItem, orderId?: string): OrderItemModel;
}
import { OrderItem } from "../../../entity/OrderItem";
import { OrderItemModel } from "../../../model/OrderItemModel";

export abstract class IOrderItemMapperService {
    abstract MapEntityToModel(entity: OrderItem): OrderItemModel;
}

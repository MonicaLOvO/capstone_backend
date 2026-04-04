import { injectable } from "tsyringe";
import { Order } from "../../../entity/Order";
import { OrderItem } from "../../../entity/OrderItem";
import { OrderModel } from "../../../model/OrderModel";
import { IOrderMapperService } from "../../interface/mapper/IOrderMapperService";
import { OrderItemModel } from "../../../model/OrderItemModel";

export { IOrderMapperService };

@injectable()
export class OrderMapperService extends IOrderMapperService {
    MapEntityToModel(entity: Order): OrderModel {
        const model = Object.assign<OrderModel, Partial<OrderModel>>(new OrderModel(), {
            Id: entity.Id,
            OrderType: entity.OrderType ?? "",
            OrderDate: entity.OrderDate ?? new Date(),
            OrderStatus: entity.OrderStatus,
            ...(entity.OrderCompletedDate ? { OrderCompletedDate: entity.OrderCompletedDate } : {}),
            OrderItems: entity.OrderItems?.map(orderItem => this.MapEntityToOrderItemModel(orderItem, entity.Id)) ?? [],
        });
        return model;
    }

    MapEntityToOrderItemModel(entity: OrderItem, orderId?: string): OrderItemModel {
        const model = Object.assign<OrderItemModel, Partial<OrderItemModel>>(new OrderItemModel(), {
            Id: entity.Id,
            OrderId: orderId ?? entity.Order?.Id ?? "",
            InventoryItemId: entity.InventoryItem?.Id ?? "",
            Quantity: entity.Quantity,
            UnitPrice: entity.UnitPrice ?? 0,
        });
        return model;
    }
}
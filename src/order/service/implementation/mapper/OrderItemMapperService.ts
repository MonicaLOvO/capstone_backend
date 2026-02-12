import { injectable } from "tsyringe";
import { OrderItem } from "../../../entity/OrderItem";
import { OrderItemModel } from "../../../model/OrderItemModel";
import { IOrderItemMapperService } from "../../interface/mapper/IOrderItemMapperService";

export { IOrderItemMapperService };

@injectable()
export class OrderItemMapperService extends IOrderItemMapperService {

    MapEntityToModel(entity: OrderItem): OrderItemModel {
        const model = Object.assign<OrderItemModel, Partial<OrderItemModel>>(new OrderItemModel(), {
            Id: entity.Id,
            OrderId: entity.Order?.Id ?? "",
            InventoryItemId: entity.InventoryItem?.Id ?? "",
            Quantity: entity.Quantity ?? 0,
            UnitPrice: entity.UnitPrice ?? 0,
        });
        return model;
    }
}

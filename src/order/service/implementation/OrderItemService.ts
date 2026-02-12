import { inject, injectable } from "tsyringe";
import { IOrderItemService } from "../interface/IOrderItemService";
import { OrderItemRepository } from "../../repository/OrderItemRepository";
import { IOrderItemMapperService } from "../interface/mapper/IOrderItemMapperService";
import { OrderItemModel } from "../../model/OrderItemModel";
import { UpsertOrderItemDto } from "../../dto/UpsertOrderItemDto";
import { OrderItem } from "../../entity/OrderItem";

export { IOrderItemService };

@injectable()
export class OrderItemService extends IOrderItemService {
    constructor(
        @inject(IOrderItemMapperService.name) private readonly mapper: IOrderItemMapperService,
        @inject(OrderItemRepository) private readonly orderItemRepository: OrderItemRepository
    ) {
        super();
    }

    async GetOrderItemsByOrderId(orderId: string, query?: Record<string, string>): Promise<[OrderItemModel[], number]> {
        const entities = await this.orderItemRepository.GetOrderItemsByOrderId(orderId, query) as OrderItem[];
        const total = await this.orderItemRepository.GetOrderItemsByOrderId(orderId, query, true) as number;
        const models = entities.map(entity => this.mapper.MapEntityToModel(entity));
        return [models, total];
    }

    async GetOrderItemById(id: string): Promise<OrderItemModel | null> {
        const entity = await this.orderItemRepository.GetOrderItemById(id);
        return entity ? this.mapper.MapEntityToModel(entity) : null;
    }

    async CreateOrderItem(dto: UpsertOrderItemDto): Promise<string> {
        if (!dto.OrderId) {
            throw new Error("OrderId is required when creating an order item");
        }
        if (!dto.InventoryItemId) {
            throw new Error("InventoryItemId is required when creating an order item");
        }
        const newId = await this.orderItemRepository.AddOrderItem(dto);
        if (!newId) {
            throw new Error("Failed to create order item");
        }
        return newId;
    }

    async UpdateOrderItem(dto: UpsertOrderItemDto): Promise<string> {
        const updatedId = await this.orderItemRepository.UpdateOrderItem(dto);
        if (!updatedId) {
            throw new Error("Failed to update order item");
        }
        return updatedId;
    }

    async DeleteOrderItem(id: string): Promise<string> {
        const deletedId = await this.orderItemRepository.DeleteOrderItem(id);
        if (!deletedId) {
            throw new Error("Failed to delete order item");
        }
        return deletedId;
    }
}

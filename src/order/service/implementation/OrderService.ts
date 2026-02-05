import { injectable, inject } from "tsyringe";
import { IOrderService } from "../interface/IOrderService";
import { OrderModel } from "../../model/OrderModel";
import { Order } from "../../entity/Order";
import { OrderRepository } from "../../repository/OrderRepository";
import { IOrderMapperService } from "../interface/mapper/IOrderMapperService";
import { OrderDto } from "../../dto/OrderDto";
export { IOrderService };

@injectable()
export class OrderService extends IOrderService {
    constructor(
        @inject(IOrderMapperService.name) private readonly mapper: IOrderMapperService,
        @inject(OrderRepository) private readonly orderRepository: OrderRepository
    ) {
        super();
    }

    async GetOrders(query?: Record<string, string>): Promise<[OrderModel[], number]> {
        const entities = await this.orderRepository.GetOrders(query) as Order[];
        const total = await this.orderRepository.GetOrders(query, true) as unknown as number;
        const models = entities.map(entity => this.mapper.MapEntityToModel(entity));
        return [models, total] as [OrderModel[], number];
    }

    async GetOrderById(id: string): Promise<OrderModel> {
        const entity = await this.orderRepository.GetOrderById(id);
        if (!entity) {
            throw new Error("Order not found");
        }
        return this.mapper.MapEntityToModel(entity);
    }

    async CreateOrder(dto: OrderDto): Promise<string> {
        const newId = await this.orderRepository.AddOrder(dto);
        if (!newId) {
            throw new Error("Failed to create order");
        }
        return newId;
    }
    async UpdateOrder(dto: OrderDto): Promise<string> {
        const updatedId = await this.orderRepository.UpdateOrder(dto);
        if (!updatedId) {
            throw new Error("Failed to update order");
        }
        return updatedId;
    }

    async DeleteOrder(id: string): Promise<string> {
        const deletedId = await this.orderRepository.DeleteOrder(id);
        if (!deletedId) {
            throw new Error("Failed to delete order");
        }
        return deletedId;
    }

}
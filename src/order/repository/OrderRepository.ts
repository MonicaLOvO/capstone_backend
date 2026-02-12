import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Order, OrderColumns } from "../entity/Order";
import { injectable } from "tsyringe";
import { OrderDto } from "../dto/UpsertOrderDto";
import { RepositoryHelper } from "../../common/helper/RepositoryHelper";
import { OrderStatusEnum } from "../enum/OrderStatusEnum";
import { OrderItem } from "../entity/OrderItem";
import { InventoryItem } from "../../inventory/entity/Inventory-item";

@injectable()
export class OrderRepository {
    private repository: Repository<Order>;

    constructor() {
        this.repository = AppDataSource.getRepository(Order);
    }

    async GetOrders(queryParams?: Record<string, string>, getTotal: boolean = false): Promise<Order[] | number> {
        const filterResult = RepositoryHelper.generateFilter(queryParams ?? {}, OrderColumns);
        const query = this.repository.createQueryBuilder("o")
        .where("o.DeletedAt IS NULL");

        if (filterResult.Filter.length > 0) {
            for (const filter of filterResult.Filter) {
                query.andWhere(filter.FilterString, filter.FilterValues);
            }
        }
        if (!getTotal && filterResult.OrderBy && filterResult.OrderBy.OrderByString) {
            query.orderBy(filterResult.OrderBy.OrderByString ?? "", filterResult.OrderBy.OrderByDirection ?? "ASC");
        }
        if (!getTotal && filterResult.Pagination && filterResult.Pagination.Page && filterResult.Pagination.PageSize) {
            query.skip((filterResult.Pagination.Page - 1) * filterResult.Pagination.PageSize);
            query.take(filterResult.Pagination.PageSize);
        }
        if (getTotal) {
            return await query.getCount();
        }
        else {
            return await query.getMany();
        }
    }

    async GetOrderById(id: string): Promise<Order | null> {
        const order = await this.repository.createQueryBuilder("o")
            .leftJoinAndSelect("o.OrderItems", "oi", "oi.DeletedAt IS NULL")
            .leftJoinAndSelect("oi.InventoryItem", "ii")
            .where("o.Id = :id", { id })
            .andWhere("o.DeletedAt IS NULL")
            .getOne();
        return order;
    }

    async AddOrder(dto: OrderDto): Promise<string> {
        const inventoryRepo = AppDataSource.getRepository(InventoryItem);

        const orderItems: OrderItem[] = [];
        for (const item of dto.OrderItems ?? []) {
            const inventoryItem = await inventoryRepo.findOne({ where: { Id: item.InventoryItemId ?? "" } });
            orderItems.push(Object.assign<OrderItem, Partial<OrderItem>>(new OrderItem(), {
                InventoryItem: { Id: item.InventoryItemId } as InventoryItem,
                Quantity: item.Quantity ?? 1,
                UnitPrice: inventoryItem?.UnitPrice ?? 0,
            }));
        }

        const newOrder = Object.assign<Order, Partial<Order>>(new Order(), {
            OrderType: dto.OrderType ?? "",
            OrderDate: dto.OrderDate ?? new Date(),
            OrderStatus: dto.OrderStatus ?? OrderStatusEnum.Pending,
            OrderCompletedDate: dto.OrderCompletedDate ?? new Date(),
            OrderItems: orderItems,
        });
        const result = await this.repository.save(newOrder);
        return result?.Id ?? "";
    }

    async UpdateOrder(dto: OrderDto): Promise<string> {
        const order = await this.repository.findOne({ where: { Id: dto.Id ?? "", DeletedAt: IsNull() } });
        if (!order) {
            throw new Error("Order not found");
        }
        Object.assign<Order, Partial<Order>>(order, {
            OrderType: dto.OrderType ?? "",
            OrderDate: dto.OrderDate ?? new Date(),
            OrderStatus: dto.OrderStatus ?? OrderStatusEnum.Pending,
            OrderCompletedDate: dto.OrderCompletedDate ?? new Date(),
        });
        const result = await this.repository.save(order);
        return result.Id;
    }

    async DeleteOrder(id: string): Promise<string> {
        const target = await this.repository.findOne({
            where: { Id: id, DeletedAt: IsNull() },
            relations: ["OrderItems"]
        });
        if (!target) {
            throw new Error("Order not found");
        }
        const now = new Date();
        target.DeletedAt = now;
        for (const item of target.OrderItems ?? []) {
            item.DeletedAt = now;
        }
        const result = await this.repository.save(target);
        return result.Id;
    }
    
}
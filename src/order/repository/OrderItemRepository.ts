import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { OrderItem, OrderItemColumns } from "../entity/OrderItem";
import { UpsertOrderItemDto } from "../dto/UpsertOrderItemDto";
import { RepositoryHelper } from "../../common/helper/RepositoryHelper";
import { Order } from "../entity/Order";
import { InventoryItem } from "../../inventory/entity/Inventory-item";

@injectable()
export class OrderItemRepository {
    private repository: Repository<OrderItem>;

    constructor() {
        this.repository = AppDataSource.getRepository(OrderItem);
    }

    async GetOrderItemsByOrderId(orderId: string, queryParams?: Record<string, string>, getTotal: boolean = false): Promise<OrderItem[] | number> {
        const filterResult = RepositoryHelper.generateFilter(queryParams ?? {}, OrderItemColumns);

        const query = this.repository.createQueryBuilder("oi")
            .leftJoinAndSelect("oi.Order", "o")
            .leftJoinAndSelect("oi.InventoryItem", "ii")
            .where("oi.DeletedAt IS NULL")
            .andWhere("o.Id = :orderId", { orderId });

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
        } else {
            return await query.getMany();
        }
    }

    async GetOrderItemById(id: string): Promise<OrderItem | null> {
        return await this.repository.findOne({
            where: { Id: id, DeletedAt: IsNull() },
            relations: ["Order", "InventoryItem"]
        });
    }

    async AddOrderItem(dto: UpsertOrderItemDto): Promise<string> {
        const inventoryRepo = AppDataSource.getRepository(InventoryItem);
        const inventoryItem = await inventoryRepo.findOne({ where: { Id: dto.InventoryItemId ?? "" } });

        const newItem = this.repository.create({
            Order: { Id: dto.OrderId } as Order,
            InventoryItem: { Id: dto.InventoryItemId } as InventoryItem,
            Quantity: dto.Quantity ?? 1,
            UnitPrice: inventoryItem?.UnitPrice ?? 0,
        });
        const result = await this.repository.save(newItem);
        return result?.Id ?? "";
    }

    async UpdateOrderItem(dto: UpsertOrderItemDto): Promise<string> {
        const target = await this.repository.findOne({ where: { Id: dto.Id ?? "", DeletedAt: IsNull() } });
        if (!target) {
            throw new Error("Order item not found");
        }

        const inventoryRepo = AppDataSource.getRepository(InventoryItem);
        const inventoryItem = await inventoryRepo.findOne({ where: { Id: dto.InventoryItemId ?? "" } });

        Object.assign<OrderItem, Partial<OrderItem>>(target, {
            Order: { Id: dto.OrderId } as Order,
            InventoryItem: { Id: dto.InventoryItemId } as InventoryItem,
            Quantity: dto.Quantity ?? 1,
            UnitPrice: inventoryItem?.UnitPrice ?? 0,
        });

        const result = await this.repository.save(target);
        return result.Id;
    }

    async DeleteOrderItem(id: string): Promise<string> {
        const target = await this.repository.findOne({ where: { Id: id, DeletedAt: IsNull() } });
        if (!target) {
            throw new Error("Order item not found");
        }

        target.DeletedAt = new Date();
        const result = await this.repository.save(target);
        return result.Id;
    }
}

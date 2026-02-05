import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Order, OrderColumns } from "../entity/Order";
import { injectable } from "tsyringe";
import { OrderDto } from "../dto/OrderDto";
import { RepositoryHelper } from "../../common/helper/RepositoryHelper";
import { OrderStatusEnum } from "../enum/OrderStatusEnum";

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
        return await this.repository.findOne({
            where: { Id: id },
            relations: ["OrderItems", "OrderItems.InventoryItem"]
        });
    }

    async AddOrder(dto: OrderDto): Promise<string> {
        const newOrder = Object.assign<Order, Partial<Order>>(new Order(), {
            OrderType: dto.OrderType ?? "",
            OrderDate: dto.OrderDate ?? new Date(),
            OrderStatus: dto.Status ?? OrderStatusEnum.Pending,
            OrderCompletedDate: dto.OrderCompletedDate ?? new Date(),
            TotalPrice: dto.TotalPrice ?? 0,
        });
        const result = await this.repository.save(newOrder);
        return result?.Id ?? "";
    }

    async UpdateOrder(dto: OrderDto): Promise<string> {
        const order = await this.repository.findOne({ where: { Id: dto.Id ?? "" } });
        if (!order) {
            throw new Error("Order not found");
        }
        Object.assign<Order, Partial<Order>>(order, {
            OrderType: dto.OrderType ?? "",
            OrderDate: dto.OrderDate ?? new Date(),
            OrderStatus: dto.Status ?? OrderStatusEnum.Pending,
            OrderCompletedDate: dto.OrderCompletedDate ?? new Date(),
            TotalPrice: dto.TotalPrice ?? 0,
        });
        const result = await this.repository.save(order);
        return result.Id;
    }

    async DeleteOrder(id: string): Promise<string> {
        const target = await this.repository.findOne({ where: { Id: id, DeletedAt: IsNull() } });
        if (!target) {
            throw new Error("Order not found");
        }
        target.DeletedAt = new Date();
        const result = await this.repository.save(target);
        return result.Id;
    }
    
}
import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put } from "routing-controllers";
import { OrderModel } from "../model/OrderModel";
import { IOrderService } from "../service/interface/IOrderService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { OrderDto } from "../dto/UpsertOrderDto";
import { PaginatedDataRespondModel } from "../../common/model/PaginatedDataRespondModel";
import { PermissionActionEnum } from "../../Permission/enum/PermissionActionEnum";
import { PermissionModuleEnum } from "../../Permission/enum/PermissionModuleEnum";
import { AndPermission } from "../../common/decorator/PermissionDecorator";

@JsonController("/api/order")
@injectable()
export class OrderController {
    constructor(
        @inject(IOrderService.name) private readonly orderService: IOrderService
    ) {}

    @Get("/list")
    @AndPermission(PermissionModuleEnum.ORDER, PermissionActionEnum.VIEW)
    async getOrders(@QueryParams() query: Record<string, string>) {
        const [data, total] = await this.orderService.GetOrders(query);
        return new PaginatedDataRespondModel<OrderModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/:id")
    @AndPermission(PermissionModuleEnum.ORDER, PermissionActionEnum.VIEW)
    async getOrderById(@Param("id") id: string) {
        const data = await this.orderService.GetOrderById(id);
        return new DataRespondModel<OrderModel>(data);
    }

    @Post("")
    @AndPermission(PermissionModuleEnum.ORDER, PermissionActionEnum.CREATE)
    async createOrder(@Body() dto: OrderDto) {
        const data = await this.orderService.CreateOrder(dto);
        return new DataRespondModel<string>(data);
    }

    @Put("/:id")
    @AndPermission(PermissionModuleEnum.ORDER, PermissionActionEnum.UPDATE)
    async updateOrder(@Param("id") id: string, @Body() dto: OrderDto) {
        dto.Id = id;
        const data = await this.orderService.UpdateOrder(dto);
        return new DataRespondModel<string>(data);
    }

    @Delete("/:id")
    @AndPermission(PermissionModuleEnum.ORDER, PermissionActionEnum.DELETE)
    async deleteOrder(@Param("id") id: string) {
        const data = await this.orderService.DeleteOrder(id);
        return new DataRespondModel<string>(data);
    }
}

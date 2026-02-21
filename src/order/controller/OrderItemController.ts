import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put } from "routing-controllers";
import { OrderItemModel } from "../model/OrderItemModel";
import { IOrderItemService } from "../service/interface/IOrderItemService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { UpsertOrderItemDto } from "../dto/UpsertOrderItemDto";
import { PaginatedDataRespondModel } from "../../common/model/PaginatedDataRespondModel";
import { PermissionModuleEnum } from "../../Permission/enum/PermissionModuleEnum";
import { PermissionActionEnum } from "../../Permission/enum/PermissionActionEnum";
import { AndPermission } from "../../common/decorator/PermissionDecorator";

@JsonController("/api/orderItem")
@injectable()
export class OrderItemController {
    constructor(
        @inject(IOrderItemService.name) private readonly orderItemService: IOrderItemService
    ) {}

    @Get("/list/:orderId")
    @AndPermission(PermissionModuleEnum.ORDER, PermissionActionEnum.VIEW)
    async getOrderItemsByOrderId(@Param("orderId") orderId: string, @QueryParams() query: Record<string, string>) {
        const [data, total] = await this.orderItemService.GetOrderItemsByOrderId(orderId, query);
        return new PaginatedDataRespondModel<OrderItemModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/:id")
    @AndPermission(PermissionModuleEnum.ORDER, PermissionActionEnum.VIEW)
    async getOrderItemById(@Param("id") id: string) {
        const data = await this.orderItemService.GetOrderItemById(id);
        return new DataRespondModel<OrderItemModel>(data);
    }

    @Post("")
    @AndPermission(PermissionModuleEnum.ORDER, PermissionActionEnum.CREATE)
    async createOrderItem(@Body() dto: UpsertOrderItemDto) {
        const data = await this.orderItemService.CreateOrderItem(dto);
        return new DataRespondModel<string>(data);
    }

    @Put("/:id")
    @AndPermission(PermissionModuleEnum.ORDER, PermissionActionEnum.UPDATE)
    async updateOrderItem(@Param("id") id: string, @Body() dto: UpsertOrderItemDto) {
        dto.Id = id;
        const data = await this.orderItemService.UpdateOrderItem(dto);
        return new DataRespondModel<string>(data);
    }

    @Delete("/:id")
    @AndPermission(PermissionModuleEnum.ORDER, PermissionActionEnum.DELETE)
    async deleteOrderItem(@Param("id") id: string) {
        const data = await this.orderItemService.DeleteOrderItem(id);
        return new DataRespondModel<string>(data);
    }
}

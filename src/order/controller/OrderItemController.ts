import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put } from "routing-controllers";
import { OrderItemModel } from "../model/OrderItemModel";
import { IOrderItemService } from "../service/interface/IOrderItemService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { UpsertOrderItemDto } from "../dto/UpsertOrderItemDto";
import { PaginatedDataRespondModel } from "../../common/model/PaginatedDataRespondModel";

@JsonController("/api/orderItem")
@injectable()
export class OrderItemController {
    constructor(
        @inject(IOrderItemService.name) private readonly orderItemService: IOrderItemService
    ) {}

    @Get("/list/:orderId")
    async getOrderItemsByOrderId(@Param("orderId") orderId: string, @QueryParams() query: Record<string, string>) {
        const [data, total] = await this.orderItemService.GetOrderItemsByOrderId(orderId, query);
        return new PaginatedDataRespondModel<OrderItemModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/:id")
    async getOrderItemById(@Param("id") id: string) {
        const data = await this.orderItemService.GetOrderItemById(id);
        return new DataRespondModel<OrderItemModel>(data);
    }

    @Post("")
    async createOrderItem(@Body() dto: UpsertOrderItemDto) {
        const data = await this.orderItemService.CreateOrderItem(dto);
        return new DataRespondModel<string>(data);
    }

    @Put("/:id")
    async updateOrderItem(@Param("id") id: string, @Body() dto: UpsertOrderItemDto) {
        dto.Id = id;
        const data = await this.orderItemService.UpdateOrderItem(dto);
        return new DataRespondModel<string>(data);
    }

    @Delete("/:id")
    async deleteOrderItem(@Param("id") id: string) {
        const data = await this.orderItemService.DeleteOrderItem(id);
        return new DataRespondModel<string>(data);
    }
}

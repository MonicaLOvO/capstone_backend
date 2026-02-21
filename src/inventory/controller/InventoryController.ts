import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put, QueryParam } from "routing-controllers";
import { InventoryItemModel } from "../model/InventoryItemModel";
import { InventoryItemSummaryModel } from "../model/InventoryItemSummaryModel";
import { IInventoryItemService } from "../service/interface/IInventoryItemService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { UpsertInventoryItemDto } from "../dto/UpsertInventoryItem";
import { PaginatedDataRespondModel } from "../../common/model/PaginatedDataRespondModel";
import { PermissionActionEnum } from "../../Permission/enum/PermissionActionEnum";
import { AndPermission } from "../../common/decorator/PermissionDecorator";
import { PermissionModuleEnum } from "../../Permission/enum/PermissionModuleEnum";


@JsonController("/api/inventory")
@injectable()
export class InventoryController {
    constructor(
        @inject(IInventoryItemService.name) private readonly inventoryItemService: IInventoryItemService
    ) {}

    @Get("/list")
    @AndPermission(PermissionModuleEnum.INVENTORY, PermissionActionEnum.VIEW)
     async getInventoryItems(@QueryParams() query: Record<string, string>) {
        const [data, total] = await this.inventoryItemService.GetInventoryItems(query);
        return new PaginatedDataRespondModel<InventoryItemModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/search")
    @AndPermission(PermissionModuleEnum.INVENTORY, PermissionActionEnum.VIEW)
    async getInventoryItemsByProductName(@QueryParam("productName") productName: string) {
        const data = await this.inventoryItemService.GetInventoryItemsByProductName(productName);
        return new DataRespondModel<InventoryItemSummaryModel>(data);
    }

    @Get("/:id") 
    @AndPermission(PermissionModuleEnum.INVENTORY, PermissionActionEnum.VIEW)
    async getInventoryItemById(@Param("id") id: string) {
        const data = await this.inventoryItemService.GetInventoryItemById(id);
        return new DataRespondModel<InventoryItemModel>(data);
    }

    @Post("")
    @AndPermission(PermissionModuleEnum.INVENTORY, PermissionActionEnum.CREATE)
    async createInventoryItem(@Body() dto: UpsertInventoryItemDto) {
        const data = await this.inventoryItemService.CreateInventoryItem(dto);
        return new DataRespondModel<string>(data);
    }

    @Put("/:id")
    @AndPermission(PermissionModuleEnum.INVENTORY, PermissionActionEnum.UPDATE)
    async updateInventoryItem(@Param("id") id: string, @Body() dto: UpsertInventoryItemDto) {
        dto.Id = id;
        const data = await this.inventoryItemService.UpdateInventoryItem(dto);
        return new DataRespondModel<string>(data);
    }

    @Delete("/:id")
    @AndPermission(PermissionModuleEnum.INVENTORY, PermissionActionEnum.DELETE)
    async deleteInventoryItem(@Param("id") id: string) {
        const data = await this.inventoryItemService.DeleteInventoryItem(id);
        return new DataRespondModel<string>(data);
    }

    
}
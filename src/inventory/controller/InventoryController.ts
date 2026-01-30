import { JsonController, Get, Param } from "routing-controllers";
import { InventoryItemModel } from "../model/InventoryItemModel";
import { IInventoryItemService } from "../service/interface/IInventoryItemService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { PaginatedDataRespondModel } from "../../common/model/PaginatedDataRespondModel";

@JsonController("/api/inventory")
@injectable()
export class InventoryController {
    constructor(
        @inject(IInventoryItemService.name) private readonly inventoryItemService: IInventoryItemService
    ) {}

    @Get("/list")
    async getInventoryItems(): Promise<PaginatedDataRespondModel<InventoryItemModel[]>> {
        const data = await this.inventoryItemService.GetInventoryItems();
        return new PaginatedDataRespondModel<InventoryItemModel[]>(data);
    }

    @Get("/:id")
    async getInventoryItemById(@Param("id") id: string): Promise<DataRespondModel<InventoryItemModel>> {
        const data = await this.inventoryItemService.GetInventoryItemById(id);
        return new DataRespondModel<InventoryItemModel>(data);
    }
}
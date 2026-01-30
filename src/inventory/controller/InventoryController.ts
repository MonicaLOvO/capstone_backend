import { JsonController, Get } from "routing-controllers";
import { InventoryItemModel } from "../model/InventoryItemModel";
import { IInventoryItemService } from "../service/interface/IInventoryItemService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";

@JsonController("/api/inventory")
@injectable()
export class InventoryController {
    constructor(
        @inject(IInventoryItemService.name) private readonly inventoryItemService: IInventoryItemService
    ) {}

    @Get("/list")
    async getInventoryItems(): Promise<DataRespondModel<InventoryItemModel[]>> {
        const data = await this.inventoryItemService.GetInventoryItems();
        return new DataRespondModel<InventoryItemModel[]>(data);
    }
}
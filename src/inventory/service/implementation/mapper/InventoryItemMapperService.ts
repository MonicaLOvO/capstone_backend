import { inject, injectable } from "tsyringe";
import { InventoryItem } from "../../../entity/Inventory-item";
import { InventoryItemModel } from "../../../model/InventoryItemModel";
import { IInventoryItemMapperService } from "../../interface/mapper/IInventoryItemMapperService";
import { IMediaMapperService } from "../../../../media/service/interface/mapper/IMediaMapperService";

export { IInventoryItemMapperService };

@injectable()
export class InventoryItemMapperService extends IInventoryItemMapperService {
    constructor(
        @inject(IMediaMapperService.name) private readonly mediaMapper: IMediaMapperService
    ) {
        super();
    }

    MapEntityToModle(entity: InventoryItem): InventoryItemModel {
        const model = Object.assign<InventoryItemModel, Partial<InventoryItemModel>>(new InventoryItemModel(), {
            Id: entity.Id,
            ProductName: entity.ItemName,
            Description: entity.Description,
            Quantity: entity.Quantity,
            UnitPrice: entity.UnitPrice,
            Category: entity.Category ?? "",
            Location: entity.Location ?? "",
            Sku: entity.Sku,
            Status: entity.Status,
            LowestStockLevel: entity.LowestStockLevel ?? 0,
        });

        model.MediaAssets = this.mediaMapper.MapEntitiesToModel(entity.MediaAssets);
        return model;
    }

   
}
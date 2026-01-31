import { injectable } from "tsyringe";
import { InventoryItem } from "../../../entity/Inventory-item";
import { InventoryItemModel } from "../../../model/InventoryItemModel";
import { IInventoryItemMapperService } from "../../interface/mapper/IInventoryItemMapperService";

export { IInventoryItemMapperService };

@injectable()
export class InventoryItemMapperService extends IInventoryItemMapperService {

    MapEntityToModle(entity: InventoryItem): InventoryItemModel {
        const model = Object.assign<InventoryItemModel, Partial<InventoryItemModel>>(new InventoryItemModel(), {
            Id: entity.Id,
            ProductName: entity.ItemName,
            Description: entity.Description,
            Quantity: entity.Quantity,
            UnitPrice: entity.UnitPrice,
            QrCodeValue: entity.QrCode ?? "",
            ImageUrl: entity.ImageUrl ?? "",
            Category: entity.Category ?? "",
            Location: entity.Location ?? "",
            Sku: entity.Sku,
            Status: entity.Status,
        });
        return model;
    }

   
}
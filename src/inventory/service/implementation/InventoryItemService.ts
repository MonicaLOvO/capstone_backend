
import { inject, injectable } from "tsyringe";
import { IInventoryItemService } from "../interface/IInventoryItemService";
import { InventoryItemRepository } from "../../repository/inventoryItemRepository";
import { IInventoryItemMapperService } from "../interface/mapper/IInventoryItemMapperService";
import { InventoryItemModel } from "../../model/InventoryItemModel";

@injectable()
export class InventoryItemService implements IInventoryItemService {
  constructor(
    @inject("IInventoryItemMapperService") private readonly mapper: IInventoryItemMapperService,
    @inject(InventoryItemRepository) private inventoryItemRepository: InventoryItemRepository
  ) { }

  async GetInventoryItems(): Promise<InventoryItemModel[]> {
    const entities = await this.inventoryItemRepository.GetInventoryItems();
    return entities.map(entity => this.mapper.MapEntityToModle(entity));
  }

}
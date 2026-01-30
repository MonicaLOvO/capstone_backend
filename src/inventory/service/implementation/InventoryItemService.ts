import { inject, injectable } from "tsyringe";
import { IInventoryItemService } from "../interface/IInventoryItemService";
import { InventoryItemRepository } from "../../repository/inventoryItemRepository";
import { IInventoryItemMapperService } from "../interface/mapper/IInventoryItemMapperService";
import { InventoryItemModel } from "../../model/InventoryItemModel";

export { IInventoryItemService };

@injectable()
export class InventoryItemService extends IInventoryItemService {
  constructor(
    @inject(IInventoryItemMapperService.name) private readonly mapper: IInventoryItemMapperService,
    @inject(InventoryItemRepository) private readonly inventoryItemRepository: InventoryItemRepository
  ) {
    super();
  }

  async GetInventoryItems(): Promise<InventoryItemModel[]> {
    const entities = await this.inventoryItemRepository.GetInventoryItems();
    return entities.map(entity => this.mapper.MapEntityToModle(entity));
  }

  async GetInventoryItemById(id: string): Promise<InventoryItemModel | null> {
    const entity = await this.inventoryItemRepository.GetInventoryItemById(id);
    return entity ? this.mapper.MapEntityToModle(entity) : null;
  }

}
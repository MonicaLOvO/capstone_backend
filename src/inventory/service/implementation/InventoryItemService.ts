import { inject, injectable } from "tsyringe";
import { IInventoryItemService } from "../interface/IInventoryItemService";
import { InventoryItemRepository } from "../../repository/inventoryItemRepository";
import { IInventoryItemMapperService } from "../interface/mapper/IInventoryItemMapperService";
import { InventoryItemModel } from "../../model/InventoryItemModel";
import { UpsertInventoryItemDto } from "../../dto/UpsertInventoryItem";
import { InventoryItem } from "../../entity/Inventory-item";

export { IInventoryItemService };

@injectable()
export class InventoryItemService extends IInventoryItemService {
  constructor(
    @inject(IInventoryItemMapperService.name) private readonly mapper: IInventoryItemMapperService,
    @inject(InventoryItemRepository) private readonly inventoryItemRepository: InventoryItemRepository
  ) {
    super();
  }

  async GetInventoryItems(query?: Record<string, string>): Promise<[InventoryItemModel[], number]> {
    const entities = await this.inventoryItemRepository.GetInventoryItems(query) as InventoryItem[];
    const total = await this.inventoryItemRepository.GetInventoryItems(query, true) as number;
    const models = entities.map(entity => this.mapper.MapEntityToModle(entity));
    return [models, total];
  }

  

  async GetInventoryItemById(id: string): Promise<InventoryItemModel | null> {
    const entity = await this.inventoryItemRepository.GetInventoryItemById(id);
    return entity ? this.mapper.MapEntityToModle(entity) : null;
  }

  async CreateInventoryItem(dto: UpsertInventoryItemDto): Promise<string> {
    const newId = await this.inventoryItemRepository.AddInventoryItem(dto);
    if (!newId) {
      throw new Error("Failed to create inventory item");
    }
    return newId;
  }

  async UpdateInventoryItem(dto: UpsertInventoryItemDto): Promise<string> {
    const updatedId = await this.inventoryItemRepository.UpdateInventoryItem(dto);
    if (!updatedId) {
      throw new Error("Failed to update inventory item");
    }
    return updatedId;
  }

  async DeleteInventoryItem(id: string): Promise<string> {
    const deletedId = await this.inventoryItemRepository.DeleteInventoryItem(id);
    if (!deletedId) {
      throw new Error("Failed to delete inventory item");
    }
    return deletedId;
  }




}
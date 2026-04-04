import { inject, injectable } from "tsyringe";
import { IInventoryItemService } from "../interface/IInventoryItemService";
import { InventoryItemRepository } from "../../repository/inventoryItemRepository";
import { IInventoryItemMapperService } from "../interface/mapper/IInventoryItemMapperService";
import { InventoryItemModel } from "../../model/InventoryItemModel";
import { InventoryItemSummaryModel } from "../../model/InventoryItemSummaryModel";
import { UpsertInventoryItemDto } from "../../dto/UpsertInventoryItem";
import { InventoryItem } from "../../entity/Inventory-item";
import { IMediaService } from "../../../media/service/interface/IMediaService";
import { MediaResourceTypeEnum } from "../../../media/enum/MediaResourceTypeEnum";

export { IInventoryItemService };

@injectable()
export class InventoryItemService extends IInventoryItemService {
  constructor(
    @inject(IInventoryItemMapperService.name) private readonly mapper: IInventoryItemMapperService,
    @inject(InventoryItemRepository) private readonly inventoryItemRepository: InventoryItemRepository,
    @inject(IMediaService.name) private readonly mediaService: IMediaService,
  ) {
    super();
  }

  async GetInventoryItems(query?: Record<string, string>): Promise<[InventoryItemModel[], number]> {
    const entities = await this.inventoryItemRepository.GetInventoryItems(query) as InventoryItem[];
    const total = await this.inventoryItemRepository.GetInventoryItems(query, true) as number;
    return [entities.map(entity => this.mapper.MapEntityToModle(entity)), total];
  }

  

  async GetInventoryItemsByProductName(productName: string): Promise<InventoryItemSummaryModel> {
    const result = await this.inventoryItemRepository.GetInventoryItemsByProductName(productName);
    const summary = new InventoryItemSummaryModel();
    summary.Items = result.items.map(entity => this.mapper.MapEntityToModle(entity));
    summary.TotalPrice = result.totalPrice;
    summary.TotalStock = result.totalStock;
    return summary;
  }

  async GetInventoryItemById(id: string): Promise<InventoryItemModel | null> {
    const entity = await this.inventoryItemRepository.GetInventoryItemById(id);
    if (!entity) return null;
    return this.mapper.MapEntityToModle(entity);
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
    // await this.mediaService.DeleteByOwner(MediaResourceTypeEnum.INVENTORY_ITEM, id, mediaId);
    return deletedId;
  }




}
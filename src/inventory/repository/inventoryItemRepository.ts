import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { InventoryItem } from "../entity/Inventory-item";


@injectable()
export class InventoryItemRepository {
  private repository: Repository<InventoryItem>;

  constructor() {
    this.repository = AppDataSource.getRepository(InventoryItem);
  }

  async GetInventoryItems(): Promise<InventoryItem[]> {
    const query = this.repository.find({
      where: {
        DeletedAt: IsNull(),
      },
    });
    ;

    return await query;
  }

  async GetInventoryItemById(id: string): Promise<InventoryItem | null> {
    return await this.repository.findOne({ where: { Id: id, DeletedAt: IsNull() } });
  }
}

import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { InventoryItem, InventoryItemColumns } from "../entity/Inventory-item";
import { UpsertInventoryItemDto } from "../dto/UpsertInventoryItem";
import { InventoryItemStatusEnum } from "../enum/InventoryItemStatusEnum";
import { QueryFilterResult } from "../../common/model/QueryFilterResult";
import { RepositoryHelper } from "../../common/helper/RepositoryHelper";


@injectable()
export class InventoryItemRepository {
  private repository: Repository<InventoryItem>;

  constructor() {
    this.repository = AppDataSource.getRepository(InventoryItem);
  }

  async GetInventoryItems(queryParams?: Record<string, string>, getTotal: boolean = false): Promise<InventoryItem[] | number> {

    const filterResult = RepositoryHelper.generateFilter(queryParams ?? {}, InventoryItemColumns);
    
    const query = this.repository.createQueryBuilder("ii")
    .where("ii.DeletedAt IS NULL");

    // Apply filters
    if(filterResult.Filter.length > 0)
    {
      for(const filter of filterResult.Filter)
      {
        query.andWhere(filter.FilterString, filter.FilterValues);
      }
    }
    // Apply order by
    if(!getTotal && filterResult.OrderBy && filterResult.OrderBy.OrderByString)
    {
      query.orderBy(filterResult.OrderBy.OrderByString ?? "", filterResult.OrderBy.OrderByDirection ?? "ASC");
    }
    // Apply pagination
    if(!getTotal && filterResult.Pagination && filterResult.Pagination.Page && filterResult.Pagination.PageSize)
    {
      query.skip((filterResult.Pagination.Page - 1) * filterResult.Pagination.PageSize);
      query.take(filterResult.Pagination.PageSize);
    }

    if(getTotal)
    {
      return await query.getCount();
    }
    else
    {
      return await query.getMany();
    }
  }

  async GetInventoryItemById(id: string): Promise<InventoryItem | null> {
    return await this.repository.findOne({ where: { Id: id, DeletedAt: IsNull() } });
  }

  async AddInventoryItem(dto: UpsertInventoryItemDto): Promise<string> {
    const newItem = this.repository.create({
      ItemName: dto.ProductName ?? "",
      Description: dto.Description ?? "",
      Quantity: dto.Quantity ?? 0,
      UnitPrice: dto.UnitPrice ?? 0,
      ImageUrl: dto.ImageUrl ?? "",
      Category: dto.Category ?? "",
      Location: dto.Location ?? "",
      Sku: dto.Sku ?? "",
      Status: dto.Status ?? InventoryItemStatusEnum.InStock,
      LowestStockLevel: dto.LowestStockLevel ?? 0
    });
    const result = await this.repository.save(newItem);
    return result?.Id ?? "";
  }

  async UpdateInventoryItem(dto: UpsertInventoryItemDto): Promise<string> {

    const target = await this.repository.findOne({ where: { Id: dto.Id ?? '', DeletedAt: IsNull() } });
    if (!target) {
      throw new Error("Inventory item not found");
    }

    Object.assign<InventoryItem, Partial<InventoryItem>>(target, {
      ItemName: dto.ProductName ?? "",
      Description: dto.Description ?? "",
      Quantity: dto.Quantity ?? 0,
      UnitPrice: dto.UnitPrice ?? 0,
      ImageUrl: dto.ImageUrl ?? "",
      Category: dto.Category ?? "",
      Location: dto.Location ?? "",
      Sku: dto.Sku ?? "",
      Status: dto.Status ?? InventoryItemStatusEnum.InStock,
      LowestStockLevel: dto.LowestStockLevel ?? 0
    });

    const result = await this.repository.save(target);
    return result.Id;
  }

  async GetInventoryItemsByProductName(productName: string): Promise<{ items: InventoryItem[], totalPrice: number, totalStock: number }> {
    const items = await this.repository.createQueryBuilder("ii")
      .where("ii.DeletedAt IS NULL")
      .andWhere("ii.ItemName LIKE :name", { name: `%${productName}%` })
      .getMany();

    const aggregates = await this.repository.createQueryBuilder("ii")
      .select("COALESCE(SUM(ii.UnitPrice * ii.Quantity), 0)", "totalPrice")
      .addSelect("COALESCE(SUM(ii.Quantity), 0)", "totalStock")
      .where("ii.DeletedAt IS NULL")
      .andWhere("ii.ItemName LIKE :name", { name: `%${productName}%` })
      .getRawOne();

    return {
      items,
      totalPrice: parseFloat(aggregates?.totalPrice ?? "0"),
      totalStock: parseInt(aggregates?.totalStock ?? "0", 10),
    };
  }

  async DeleteInventoryItem(id: string): Promise<string> {


    const target = await this.repository.findOne({ where: { Id: id, DeletedAt: IsNull() } });
    if (!target) {
      throw new Error("Inventory item not found");
    }

    target.DeletedAt = new Date();
    const result = await this.repository.save(target);
    return result.Id;
  }
}

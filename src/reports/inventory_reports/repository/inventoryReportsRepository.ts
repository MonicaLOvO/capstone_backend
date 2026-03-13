import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../../data-source";
import {
  InventoryReportsItem,
  InventoryReportsItemColumns,
} from "../entity/inventoryReportsItem";
import { UpsertInventoryReportDto } from "../dto/upsertInventoryReports";
import { RepositoryHelper } from "../../../common/helper/RepositoryHelper";

@injectable()
export class InventoryReportsRepository {
  private repository: Repository<InventoryReportsItem>;

  constructor() {
    this.repository = AppDataSource.getRepository(InventoryReportsItem);
  }

  async GetInventoryReports(
    queryParams?: Record<string, string>,
    getTotal?: false
  ): Promise<InventoryReportsItem[]>;

  async GetInventoryReports(
    queryParams: Record<string, string> | undefined,
    getTotal: true
  ): Promise<number>;

  async GetInventoryReports(
    queryParams?: Record<string, string>,
    getTotal: boolean = false
  ): Promise<InventoryReportsItem[] | number> {
    const filterResult = RepositoryHelper.generateFilter(
      queryParams ?? {},
      InventoryReportsItemColumns
    );

    const query = this.repository
      .createQueryBuilder("iri")
      .where("iri.DeletedAt IS NULL");

    if (filterResult.Filter.length > 0) {
      for (const filter of filterResult.Filter) {
        query.andWhere(filter.FilterString, filter.FilterValues);
      }
    }

    if (!getTotal && filterResult.OrderBy && filterResult.OrderBy.OrderByString) {
      query.orderBy(
        filterResult.OrderBy.OrderByString ?? "",
        filterResult.OrderBy.OrderByDirection ?? "ASC"
      );
    }

    if (
      !getTotal &&
      filterResult.Pagination &&
      filterResult.Pagination.Page &&
      filterResult.Pagination.PageSize
    ) {
      query.skip(
        (filterResult.Pagination.Page - 1) * filterResult.Pagination.PageSize
      );
      query.take(filterResult.Pagination.PageSize);
    }

    if (getTotal) {
      return await query.getCount();
    } else {
      return await query.getMany();
    }
  }

  async GetInventoryReportById(id: string): Promise<InventoryReportsItem | null> {
    return await this.repository.findOne({
      where: { Id: id, DeletedAt: IsNull() },
    });
  }

  async AddInventoryReport(dto: UpsertInventoryReportDto): Promise<string> {
    // build a partial object and cast to satisfy deep partial requirements
    const payload: Partial<InventoryReportsItem> = {
      ItemName: dto.ItemName ?? "",
      reportedBy: dto.reportedBy ?? "",
      ReportType: dto.ReportType ?? dto.ReportTypeEnum as any,
      Description: dto.Description ?? "",
      AdditionalNotes: dto.AdditionalNotes ?? "",
    };

    const newReport = this.repository.create(payload as any);

    const result = (await this.repository.save(newReport)) as unknown as InventoryReportsItem;
    return result.Id ?? "";
  }

  async UpdateInventoryReport(dto: UpsertInventoryReportDto): Promise<string> {
    const target = await this.repository.findOne({
      where: { Id: dto.Id ?? "", DeletedAt: IsNull() },
    });

    if (!target) {
      throw new Error("Inventory report not found");
    }

    Object.assign(target, {
      ...(dto.ItemName !== undefined ? { ItemName: dto.ItemName } : {}),
      ...(dto.reportedBy !== undefined ? { reportedBy: dto.reportedBy } : {}),
      ...(dto.ReportType !== undefined ? { ReportType: dto.ReportType } : {}),
      ...(dto.Description !== undefined ? { Description: dto.Description } : {}),
      ...(dto.AdditionalNotes !== undefined ? { AdditionalNotes: dto.AdditionalNotes } : {}),
    });

    const result = await this.repository.save(target);
    return result.Id;
  }

  async DeleteInventoryReport(id: string): Promise<string> {
    const target = await this.repository.findOne({
      where: { Id: id, DeletedAt: IsNull() },
    });

    if (!target) {
      throw new Error("Inventory report not found");
    }

    target.DeletedAt = new Date();
    const result = await this.repository.save(target);
    return result.Id;
  }
}

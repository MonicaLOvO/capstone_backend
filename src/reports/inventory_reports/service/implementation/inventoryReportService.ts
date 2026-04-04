import { inject, injectable } from "tsyringe";
import { IInventoryReportService } from "../interface/inventoryReportService";
import { InventoryReportsRepository } from "../../repository/inventoryReportsRepository";
import { IInventoryReportMapperService } from "../interface/mapper/inventoryReportMapperService";
import { InventoryReportModel } from "../../model/inventoryReportModel";
import { UpsertInventoryReportDto } from "../../dto/upsertInventoryReports";

export { IInventoryReportService };

@injectable()
export class InventoryReportService extends IInventoryReportService {
  constructor(
    @inject(IInventoryReportMapperService.name)
    private readonly mapper: IInventoryReportMapperService,
    @inject(InventoryReportsRepository)
    private readonly repository: InventoryReportsRepository
  ) {
    super();
  }

  async GetInventoryReports(
    query?: Record<string, string>
  ): Promise<[InventoryReportModel[], number]> {
    const entities = await this.repository.GetInventoryReports(query);
    const total = await this.repository.GetInventoryReports(query, true);
    const models = entities.map((e) => this.mapper.MapEntityToModel(e));
    return [models, total];
  }

  async GetInventoryReportById(id: string): Promise<InventoryReportModel | null> {
    const entity = await this.repository.GetInventoryReportById(id);
    return entity ? this.mapper.MapEntityToModel(entity) : null;
  }

  async CreateInventoryReport(dto: UpsertInventoryReportDto): Promise<string> {
    const newId = await this.repository.AddInventoryReport(dto);
    if (!newId) {
      throw new Error("Failed to create inventory report");
    }
    return newId;
  }

  async UpdateInventoryReport(dto: UpsertInventoryReportDto): Promise<string> {
    const updatedId = await this.repository.UpdateInventoryReport(dto);
    if (!updatedId) {
      throw new Error("Failed to update inventory report");
    }
    return updatedId;
  }

  async DeleteInventoryReport(id: string): Promise<string> {
    const deletedId = await this.repository.DeleteInventoryReport(id);
    if (!deletedId) {
      throw new Error("Failed to delete inventory report");
    }
    return deletedId;
  }
}
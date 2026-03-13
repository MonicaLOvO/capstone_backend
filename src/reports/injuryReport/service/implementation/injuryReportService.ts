import { inject, injectable } from "tsyringe";
import { IInjuryReportService } from "../interface/injuryReportService";
import { InjuryReportRepository } from "../../repository/injuryReportRespository";
import { IInjuryReportMapperService } from "../interface/mapper/injuryReportMapperService";
import { InjuryReportModel } from "../../model/injuryReportModel";
import { UpsertInjuryReportDto } from "../../dto/upsertInjuryReportDto";

export { IInjuryReportService };

@injectable()
export class InjuryReportService extends IInjuryReportService {
  constructor(
    @inject(IInjuryReportMapperService.name) private readonly mapper: IInjuryReportMapperService,
    @inject(InjuryReportRepository) private readonly injuryReportRepository: InjuryReportRepository
  ) {
    super();
  }

  async GetInjuryReports(query?: Record<string, string>): Promise<[InjuryReportModel[], number]> {
    const entities = await this.injuryReportRepository.GetInjuryReports(query);
    const total = await this.injuryReportRepository.GetInjuryReports(query, true);
    const models = entities.map((e) => this.mapper.MapEntityToModel(e));
    return [models, total];
  }

  async GetInjuryReportById(id: string): Promise<InjuryReportModel | null> {
    const entity = await this.injuryReportRepository.GetInjuryReportById(id);
    return entity ? this.mapper.MapEntityToModel(entity) : null;
  }

  async CreateInjuryReport(dto: UpsertInjuryReportDto): Promise<string> {
    const newId = await this.injuryReportRepository.AddInjuryReport(dto);
    if (!newId) {
      throw new Error("Failed to create injury report");
    }
    return newId;
  }

  async UpdateInjuryReport(dto: UpsertInjuryReportDto): Promise<string> {
    const updatedId = await this.injuryReportRepository.UpdateInjuryReport(dto);
    if (!updatedId) {
      throw new Error("Failed to update injury report");
    }
    return updatedId;
  }

  async DeleteInjuryReport(id: string): Promise<string> {
    const deletedId = await this.injuryReportRepository.DeleteInjuryReport(id);
    if (!deletedId) {
      throw new Error("Failed to delete injury report");
    }
    return deletedId;
  }
}

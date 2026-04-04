import { InjuryReportModel } from "../../model/injuryReportModel";
import { UpsertInjuryReportDto } from "../../dto/upsertInjuryReportDto";

export abstract class IInjuryReportService {
  abstract GetInjuryReports(query?: Record<string, string>): Promise<[InjuryReportModel[], number]>;
  abstract GetInjuryReportById(id: string): Promise<InjuryReportModel | null>;
  abstract CreateInjuryReport(dto: UpsertInjuryReportDto): Promise<string>;
  abstract UpdateInjuryReport(dto: UpsertInjuryReportDto): Promise<string>;
  abstract DeleteInjuryReport(id: string): Promise<string>;
}

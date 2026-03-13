import { injectable } from "tsyringe";
import { InjuryReport } from "../../../entity/injuryReportEntity";
import { InjuryReportModel } from "../../../model/injuryReportModel";
import { IInjuryReportMapperService } from "../../interface/mapper/injuryReportMapperService";

export { IInjuryReportMapperService };

@injectable()
export class InjuryReportMapperService implements IInjuryReportMapperService {
    MapEntityToModel(entity: InjuryReport): InjuryReportModel {
        const model: InjuryReportModel = {
            id: entity.Id,
            employeeName: entity.EmployeeName,
            reportedBy: entity.ReportedBy,
            injuryType: entity.InjuryType,
            description: entity.Description,
            additionalNotes: entity.AdditionalNotes ?? "",
            reportDate: entity.ReportDate,
            location: entity.Location ?? "",
            witnesses: entity.Witnesses ?? "",
        };
        return model;
    }
}

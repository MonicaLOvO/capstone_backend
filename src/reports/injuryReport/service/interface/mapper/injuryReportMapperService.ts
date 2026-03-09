import { InjuryReport } from "../../../entity/injuryReportEntity";
import { InjuryReportModel } from "../../../model/injuryReportModel";

export abstract class IInjuryReportMapperService {
    abstract MapEntityToModel(entity: InjuryReport): InjuryReportModel;
}

import {injectable } from "tsyringe";
import { EmployeeReport } from  "../../../entity/employeeReportsEnity";
import { EmployeeReportModel } from "../../../model/employeeReportModel";
import { IEmployeeReportMapperService } from "../../interface/mapper/employeeReportMapperService";

export { IEmployeeReportMapperService };

@injectable()
export class EmployeeReportMapperService implements IEmployeeReportMapperService {
    MapEntityToModel(entity: EmployeeReport): EmployeeReportModel {
        // EmployeeReportModel is defined as an interface, not a class, so we
        // build a plain object rather than trying to instantiate it.
        const model: EmployeeReportModel = {
            id: entity.Id,
            employeeId: entity.employeeId,
            employeeName: entity.employeeName,
            department: entity.department ?? "",
            reportType: entity.reportType,
            reportDate: entity.reportDate,
            reportedBy: entity.reportedBy,
            description: entity.description,
            previousWarnings: entity.previousWarnings ?? "",
            additionalNotes: entity.additionalNotes ?? "",
            actionTaken: entity.actionTaken ?? "",
        };
        return model;
    }

}

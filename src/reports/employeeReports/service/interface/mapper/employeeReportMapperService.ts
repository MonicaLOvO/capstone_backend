import { EmployeeReport } from "../../../entity/employeeReportsEnity";
import { EmployeeReportModel } from "../../../model/employeeReportModel";

export abstract class IEmployeeReportMapperService {
    abstract MapEntityToModel(entity: EmployeeReport): EmployeeReportModel;
}
import { UpsertEmployeeReportDto } from "../../dto/upsertEmployeeReportDto";
import { EmployeeReportModel } from "../../model/employeeReportModel";

export abstract class IEmployeeReportService {
    abstract GetEmployeeReports(query?: Record<string, string>): Promise<[EmployeeReportModel[], number]>;
    abstract GetEmployeeReportById(id: string): Promise<EmployeeReportModel | null>;
    abstract CreateEmployeeReport(dto: UpsertEmployeeReportDto): Promise<string>;
    abstract UpdateEmployeeReport(dto: UpsertEmployeeReportDto): Promise<string>;
    abstract DeleteEmployeeReport(id: string): Promise<string>;
}
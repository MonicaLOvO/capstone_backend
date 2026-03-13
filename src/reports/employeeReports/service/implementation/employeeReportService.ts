import {inject, injectable} from "tsyringe";
import { IEmployeeReportService } from "../interface/employeeReportService";
import { EmployeeReportRepository } from "../../repository/employeeReportRepository";
import { IEmployeeReportMapperService } from "../interface/mapper/employeeReportMapperService";
import { EmployeeReportModel } from "../../model/employeeReportModel";

export { IEmployeeReportService };

@injectable()
export class EmployeeReportService extends IEmployeeReportService {
    constructor(
        @inject(IEmployeeReportMapperService.name) private readonly mapper: IEmployeeReportMapperService,
        @inject(EmployeeReportRepository) private readonly employeeReportRepository: EmployeeReportRepository
    ) {
        super();
    }

    async GetEmployeeReports(query?: Record<string, string>): Promise<[EmployeeReportModel[], number]> {
        const entities = await this.employeeReportRepository.GetEmployeeReports(query);
        const total = await this.employeeReportRepository.GetEmployeeReports(query, true);
        const models = entities.map(entity => this.mapper.MapEntityToModel(entity));
        return [models, total];
    }

    async GetEmployeeReportById(id: string): Promise<EmployeeReportModel | null> {
        const entity = await this.employeeReportRepository.GetEmployeeReportById(id);
        return entity ? this.mapper.MapEntityToModel(entity) : null;
    }

    async CreateEmployeeReport(dto: any): Promise<string> {
        const newId = await this.employeeReportRepository.AddEmployeeReport(dto);
        if (!newId) {
            throw new Error("Failed to create employee report");
        }
        return newId;
    }

    async UpdateEmployeeReport(dto: any): Promise<string> {
        const updatedId = await this.employeeReportRepository.UpdateEmployeeReport(dto);
        if (!updatedId) {
            throw new Error("Failed to update employee report");
        }
        return updatedId;
    }

    async DeleteEmployeeReport(id: string): Promise<string> {
        const deletedId = await this.employeeReportRepository.DeleteEmployeeReport(id);
        if (!deletedId) {
            throw new Error("Failed to delete employee report");
        }
        return deletedId;
    }

}
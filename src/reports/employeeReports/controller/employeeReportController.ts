import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put } from "routing-controllers";
import { EmployeeReportModel } from "../model/employeeReportModel";
import { IEmployeeReportService } from "../service/interface/employeeReportService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../../common/model/DataRespondModel";
import { UpsertEmployeeReportDto } from "../dto/upsertEmployeeReportDto";
import { PaginatedDataRespondModel } from "../../../common/model/PaginatedDataRespondModel";

@JsonController("/api/employee-reports")
@injectable()
export class EmployeeReportController {
    constructor(
        @inject(IEmployeeReportService.name) private readonly employeeReportService: IEmployeeReportService
    ) {}

    @Get("/list")
     async getEmployeeReports(@QueryParams() query: Record<string, string>) {
        const [data, total] = await this.employeeReportService.GetEmployeeReports(query);
        return new PaginatedDataRespondModel<EmployeeReportModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/:id")
    async getEmployeeReportById(@Param("id") id: string) {
        const data = await this.employeeReportService.GetEmployeeReportById(id);
        return new DataRespondModel<EmployeeReportModel>(data);
    }

    @Post("")
    async createEmployeeReport(@Body() dto: UpsertEmployeeReportDto) {
        const data = await this.employeeReportService.CreateEmployeeReport(dto);
        return new DataRespondModel<string>(data);
    }

    @Put("/:id")
    async updateEmployeeReport(@Param("id") id: string, @Body() dto: UpsertEmployeeReportDto) {
        dto.Id = id;
        const data = await this.employeeReportService.UpdateEmployeeReport(dto);    
        return new DataRespondModel<string>(data);
    }

    @Delete("/:id")
    async deleteEmployeeReport(@Param("id") id: string) {
        const data = await this.employeeReportService.DeleteEmployeeReport(id);
        return new DataRespondModel<string>(data);
    }
}
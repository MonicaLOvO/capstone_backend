import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put } from "routing-controllers";
import { InjuryReportModel } from "../model/injuryReportModel";
import { IInjuryReportService } from "../service/interface/injuryReportService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../../common/model/DataRespondModel";
import { UpsertInjuryReportDto } from "../dto/upsertInjuryReportDto";
import { PaginatedDataRespondModel } from "../../../common/model/PaginatedDataRespondModel";

@JsonController("/api/injury-reports")
@injectable()
export class InjuryReportController {
    constructor(
        @inject(IInjuryReportService.name) private readonly injuryReportService: IInjuryReportService
    ) {}

    @Get("/list")
    async getInjuryReports(@QueryParams() query: Record<string, string>) {
        const [data, total] = await this.injuryReportService.GetInjuryReports(query);
        return new PaginatedDataRespondModel<InjuryReportModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/:id")
    async getInjuryReportById(@Param("id") id: string) {
        const data = await this.injuryReportService.GetInjuryReportById(id);
        return new DataRespondModel<InjuryReportModel>(data);
    }

    @Post("")
    async createInjuryReport(@Body() dto: UpsertInjuryReportDto) {
        const data = await this.injuryReportService.CreateInjuryReport(dto);
        return new DataRespondModel<string>(data);
    }

    @Put("/:id")
    async updateInjuryReport(@Param("id") id: string, @Body() dto: UpsertInjuryReportDto) {
        dto.id = id;
        const data = await this.injuryReportService.UpdateInjuryReport(dto);
        return new DataRespondModel<string>(data);
    }

    @Delete("/:id")
    async deleteInjuryReport(@Param("id") id: string) {
        const data = await this.injuryReportService.DeleteInjuryReport(id);
        return new DataRespondModel<string>(data);
    }
}

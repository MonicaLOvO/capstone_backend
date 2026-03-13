import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put } from "routing-controllers";
import { InventoryReportModel } from "../model/inventoryReportModel";
import { IInventoryReportService } from "../service/interface/inventoryReportService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../../common/model/DataRespondModel";
import { UpsertInventoryReportDto } from "../dto/upsertInventoryReports";
import { PaginatedDataRespondModel } from "../../../common/model/PaginatedDataRespondModel";

@JsonController("/api/inventory-reports")
@injectable()
export class InventoryReportController {
    constructor(
        @inject(IInventoryReportService.name) private readonly inventoryReportService: IInventoryReportService
    ) {}

    @Get("/list")
    async getInventoryReports(@QueryParams() query: Record<string, string>) {
        const [data, total] = await this.inventoryReportService.GetInventoryReports(query);
        return new PaginatedDataRespondModel<InventoryReportModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/:id")
    async getInventoryReportById(@Param("id") id: string) {
        const data = await this.inventoryReportService.GetInventoryReportById(id);
        return new DataRespondModel<InventoryReportModel>(data);
    }

    @Post("")
    async createInventoryReport(@Body() dto: UpsertInventoryReportDto) {
        const data = await this.inventoryReportService.CreateInventoryReport(dto);
        return new DataRespondModel<string>(data);
    }

    @Put("/:id")
    async updateInventoryReport(@Param("id") id: string, @Body() dto: UpsertInventoryReportDto) {
        dto.Id = id;
        const data = await this.inventoryReportService.UpdateInventoryReport(dto);
        return new DataRespondModel<string>(data);
    }

    @Delete("/:id")
    async deleteInventoryReport(@Param("id") id: string) {
        const data = await this.inventoryReportService.DeleteInventoryReport(id);
        return new DataRespondModel<string>(data);
    }
}
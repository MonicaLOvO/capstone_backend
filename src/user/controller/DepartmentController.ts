import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put } from "routing-controllers";
import { DepartmentModel } from "../model/DepartmentModel";
import { IDepartmentService } from "../service/interface/IDepartmentService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { UpsertDepartmentDto } from "../dto/UpsertDepartment";
import { PaginatedDataRespondModel } from "../../common/model/PaginatedDataRespondModel";

@JsonController("/api/department")
@injectable()
export class DepartmentController {
    constructor(
        @inject(IDepartmentService.name) private readonly departmentService: IDepartmentService
    ) {}

    @Get("/list")
    async getDepartments(@QueryParams() query: Record<string, string>) {
        const [data, total] = await this.departmentService.GetDepartments(query);
        return new PaginatedDataRespondModel<DepartmentModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/:id")
    async getDepartmentById(@Param("id") id: string) {
        const data = await this.departmentService.GetDepartmentById(id);
        return new DataRespondModel<DepartmentModel>(data);
    }

    @Post("")
    async createDepartment(@Body() dto: UpsertDepartmentDto) {
        const data = await this.departmentService.CreateDepartment(dto);
        return new DataRespondModel<string>(data);
    }

    @Put("/:id")
    async updateDepartment(@Param("id") id: string, @Body() dto: UpsertDepartmentDto) {
        dto.DepartmentId = id;
        const data = await this.departmentService.UpdateDepartment(dto);
        return new DataRespondModel<string>(data);
    }

    @Delete("/:id")
    async deleteDepartment(@Param("id") id: string) {
        const data = await this.departmentService.DeleteDepartment(id);
        return new DataRespondModel<string>(data);
    }
}

import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put } from "routing-controllers";
import { DepartmentModel } from "../model/DepartmentModel";
import { IDepartmentService } from "../service/interface/IDepartmentService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { UpsertDepartmentDto } from "../dto/UpsertDepartment";
import { PaginatedDataRespondModel } from "../../common/model/PaginatedDataRespondModel";
import { PermissionModuleEnum } from "../../Permission/enum/PermissionModuleEnum";
import { PermissionActionEnum } from "../../Permission/enum/PermissionActionEnum";
import { AndPermission } from "../../common/decorator/PermissionDecorator";

@JsonController("/api/department")
@injectable()
export class DepartmentController {
    constructor(
        @inject(IDepartmentService.name) private readonly departmentService: IDepartmentService
    ) {}

    @Get("/list")
    @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.VIEW)
    async getDepartments(@QueryParams() query: Record<string, string>) {
        const [data, total] = await this.departmentService.GetDepartments(query);
        return new PaginatedDataRespondModel<DepartmentModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/:id")
    @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.VIEW)
    async getDepartmentById(@Param("id") id: string) {
        const data = await this.departmentService.GetDepartmentById(id);
        return new DataRespondModel<DepartmentModel>(data);
    }

    @Post("")
    @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.CREATE)
    async createDepartment(@Body() dto: UpsertDepartmentDto) {
        const data = await this.departmentService.CreateDepartment(dto);
        return new DataRespondModel<string>(data);
    }

    @Put("/:id")
    @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.UPDATE)
    async updateDepartment(@Param("id") id: string, @Body() dto: UpsertDepartmentDto) {
        dto.Id = id;
        const data = await this.departmentService.UpdateDepartment(dto);
        return new DataRespondModel<string>(data);
    }

    @Delete("/:id")
    @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.DELETE)
    async deleteDepartment(@Param("id") id: string) {
        const data = await this.departmentService.DeleteDepartment(id);
        return new DataRespondModel<string>(data);
    }
}

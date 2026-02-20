import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put } from "routing-controllers";
import { PermissionModel } from "../model/PermissionModel";
import { IPermissionService } from "../service/interface/IPermissionService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { UpsertPermissionDto } from "../dto/UpsertPermission";
import { PaginatedDataRespondModel } from "../../common/model/PaginatedDataRespondModel";
import { AndPermission } from "../../common/decorator/PermissionDecorator";
import { PermissionModuleEnum } from "../enum/PermissionModuleEnum";
import { PermissionActionEnum } from "../enum/PermissionActionEnum";

@JsonController("/api/permission")
@injectable()
export class PermissionController {
    constructor(
        @inject(IPermissionService.name) private readonly permissionService: IPermissionService
    ) {}

    @Get("/list")
    @AndPermission(PermissionModuleEnum.ROLE, PermissionActionEnum.VIEW)
    async getPermissions(@QueryParams() query: Record<string, string>) {
        const [data, total] = await this.permissionService.GetPermissions(query);
        return new PaginatedDataRespondModel<PermissionModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/:id")
    @AndPermission(PermissionModuleEnum.ROLE, PermissionActionEnum.VIEW)
    async getPermissionById(@Param("id") id: string) {
        const data = await this.permissionService.GetPermissionById(id);
        return new DataRespondModel<PermissionModel>(data);
    }

    // @Post("")
    // async createPermission(@Body() dto: UpsertPermissionDto) {
    //     const data = await this.permissionService.CreatePermission(dto);
    //     return new DataRespondModel<string>(data);
    // }

    // @Put("/:id")
    // async updatePermission(@Param("id") id: string, @Body() dto: UpsertPermissionDto) {
    //     dto.PermissionId = id;
    //     const data = await this.permissionService.UpdatePermission(dto);
    //     return new DataRespondModel<string>(data);
    // }

    // @Delete("/:id")
    // async deletePermission(@Param("id") id: string) {
    //     const data = await this.permissionService.DeletePermission(id);
    //     return new DataRespondModel<string>(data);
    // }
}

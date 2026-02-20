import { JsonController, Get, Param, Post, Body, Delete, Put, QueryParams } from "routing-controllers";
import { IRolePermissionService } from "../service/interface/IRolePermissionService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { PaginatedDataRespondModel } from "../../common/model/PaginatedDataRespondModel";
import { UpsertRolePermissionDto } from "../dto/UpsertRolePermission";
import { AndPermission } from "../../common/decorator/PermissionDecorator";
import { PermissionModuleEnum } from "../enum/PermissionModuleEnum";
import { PermissionActionEnum } from "../enum/PermissionActionEnum";
import { PermissionModel } from "../model/PermissionModel";

@JsonController("/api/role-permission")
@injectable()
export class RolePermissionController {
    constructor(
        @inject(IRolePermissionService.name) private readonly rolePermissionService: IRolePermissionService
    ) {}

    @Get("/role/:roleId")
    @AndPermission(PermissionModuleEnum.ROLE, PermissionActionEnum.VIEW)
    async getPermissionsByRole(@Param("roleId") roleId: string, @QueryParams() query: Record<string, string>) {
        const [data, total] = await this.rolePermissionService.GetPermissionsByRoleId(roleId, query);
        return new PaginatedDataRespondModel<PermissionModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Post("/assign")
    @AndPermission(PermissionModuleEnum.ROLE, PermissionActionEnum.CREATE)
    async assignPermission(@Body() dto: UpsertRolePermissionDto) {
        const data = await this.rolePermissionService.AssignPermission(dto);
        return new DataRespondModel<string>(data);
    }

    @Post("/assign-bulk")
    @AndPermission(PermissionModuleEnum.ROLE, PermissionActionEnum.CREATE)
    async assignBulkPermissions(@Body() dto: UpsertRolePermissionDto) {
        const count = await this.rolePermissionService.AssignBulkPermissions(dto);
        return new DataRespondModel<string>(`${count} permissions assigned`);
    }

    @Put("/replace")
    @AndPermission(PermissionModuleEnum.ROLE, PermissionActionEnum.UPDATE)
    async replacePermissions(@Body() dto: UpsertRolePermissionDto) {
        const count = await this.rolePermissionService.ReplacePermissions(dto);
        return new DataRespondModel<string>(`Replaced with ${count} permissions`);
    }

    @Delete("/role/:roleId/permission/:permissionId")
    @AndPermission(PermissionModuleEnum.ROLE, PermissionActionEnum.DELETE)
    async removePermission(@Param("roleId") roleId: string, @Param("permissionId") permissionId: string) {
        const data = await this.rolePermissionService.RemovePermission(roleId, permissionId);
        return new DataRespondModel<string>(data);
    }
}

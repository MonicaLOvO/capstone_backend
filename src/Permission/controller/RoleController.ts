import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put } from "routing-controllers";
import { RoleModel } from "../model/RoleModel";
import { IRoleService } from "../service/interface/IRoleService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { UpsertRoleDto } from "../dto/UpsertRole";
import { PaginatedDataRespondModel } from "../../common/model/PaginatedDataRespondModel";
import { PermissionModuleEnum } from "../enum/PermissionModuleEnum";
import { PermissionActionEnum } from "../enum/PermissionActionEnum";
import { AndPermission } from "../../common/decorator/PermissionDecorator";

@JsonController("/api/role")
@injectable()
export class RoleController {
    constructor(
        @inject(IRoleService.name) private readonly roleService: IRoleService
    ) {}

    @Get("/list")
    @AndPermission(PermissionModuleEnum.ROLE, PermissionActionEnum.VIEW)
    async getRoles(@QueryParams() query: Record<string, string>) {
        const [data, total] = await this.roleService.GetRoles(query);
        return new PaginatedDataRespondModel<RoleModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/:id")
    @AndPermission(PermissionModuleEnum.ROLE, PermissionActionEnum.VIEW)
    async getRoleById(@Param("id") id: string) {
        const data = await this.roleService.GetRoleById(id);
        return new DataRespondModel<RoleModel>(data);
    }

    @Post("")
    @AndPermission(PermissionModuleEnum.ROLE, PermissionActionEnum.CREATE)
    async createRole(@Body() dto: UpsertRoleDto) {
        const data = await this.roleService.CreateRole(dto);
        return new DataRespondModel<string>(data);
    }

    @Put("/:id")
    @AndPermission(PermissionModuleEnum.ROLE, PermissionActionEnum.UPDATE)
    async updateRole(@Param("id") id: string, @Body() dto: UpsertRoleDto) {
        dto.Id = id;
        const data = await this.roleService.UpdateRole(dto);
        return new DataRespondModel<string>(data);
    }

    @Delete("/:id")
    @AndPermission(PermissionModuleEnum.ROLE, PermissionActionEnum.DELETE)
    async deleteRole(@Param("id") id: string) {
        const data = await this.roleService.DeleteRole(id);
        return new DataRespondModel<string>(data);
    }
}

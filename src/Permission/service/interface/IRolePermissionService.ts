import { PermissionModel } from "../../model/PermissionModel";
import { UpsertRolePermissionDto } from "../../dto/UpsertRolePermission";

export abstract class IRolePermissionService {
    abstract GetPermissionsByRoleId(roleId: string, query?: Record<string, string>): Promise<[PermissionModel[], number]>;
    abstract UpsertPermissions(dto: UpsertRolePermissionDto): Promise<number>;
}

import { RolePermissionModel } from "../../model/RolePermissionModel";
import { UpsertRolePermissionDto } from "../../dto/UpsertRolePermission";

export abstract class IRolePermissionService {
    abstract GetPermissionsByRoleId(roleId: string, query?: Record<string, string>): Promise<[RolePermissionModel[], number]>;
    abstract AssignPermission(dto: UpsertRolePermissionDto): Promise<string>;
    abstract AssignBulkPermissions(dto: UpsertRolePermissionDto): Promise<number>;
    abstract RemovePermission(roleId: string, permissionId: string): Promise<string>;
    abstract ReplacePermissions(dto: UpsertRolePermissionDto): Promise<number>;
}

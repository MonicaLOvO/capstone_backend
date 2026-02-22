import { PermissionModel } from "../../model/PermissionModel";
import { UpsertRolePermissionDto } from "../../dto/UpsertRolePermission";

export abstract class IRolePermissionService {
    abstract GetPermissionsByRoleId(roleId: string, query?: Record<string, string>): Promise<[PermissionModel[], number]>;
    abstract AssignPermission(dto: UpsertRolePermissionDto): Promise<string>;
    abstract AssignBulkPermissions(dto: UpsertRolePermissionDto): Promise<number>;
    abstract RemovePermission(roleId: string, permissionId: string): Promise<string>;
    abstract UpsertPermissions(dto: UpsertRolePermissionDto): Promise<number>;
}

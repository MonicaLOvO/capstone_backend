import { UpsertPermissionDto } from "../../dto/UpsertPermission";
import { PermissionModel } from "../../model/PermissionModel";

export abstract class IPermissionService {
    abstract GetPermissions(query?: Record<string, string>): Promise<[PermissionModel[], number]>;
    abstract GetPermissionById(id: string): Promise<PermissionModel | null>;
    // abstract CreatePermission(dto: UpsertPermissionDto): Promise<string>;
    // abstract UpdatePermission(dto: UpsertPermissionDto): Promise<string>;
    // abstract DeletePermission(id: string): Promise<string>;
}

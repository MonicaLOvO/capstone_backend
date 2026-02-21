import { PermissionModel } from "./PermissionModel";

export class RoleModel {
    Id!: string;
    RoleName?: string;
    Description?: string;
    Permissions?: PermissionModel[];
}

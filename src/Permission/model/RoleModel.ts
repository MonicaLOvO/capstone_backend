import { PermissionModel } from "./PermissionModel";

export class RoleModel {
    RoleId!: string;
    RoleName?: string;
    Description?: string;
    Permissions?: PermissionModel[];
}

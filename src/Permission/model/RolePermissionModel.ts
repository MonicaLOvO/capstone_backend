import { PermissionModel } from "./PermissionModel";

export class RolePermissionModel extends PermissionModel {
    ExpiresAt?: Date | null;
}

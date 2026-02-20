import { PermissionActionEnum } from "../enum/PermissionActionEnum";
import { PermissionModuleEnum } from "../enum/PermissionModuleEnum";

export class PermissionModel {
    Id!: string;
    PermissionAction?: PermissionActionEnum;
    Module?: PermissionModuleEnum;
    Description?: string;
}

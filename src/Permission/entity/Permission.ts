import { Column, Entity, OneToMany, Relation } from "typeorm";
import { Tracking } from "../../common/entity/Tracking";
import { RolePermission } from "./RolePermission";
import { PermissionActionEnum } from "../enum/PermissionActionEnum";
import { PermissionModuleEnum } from "../enum/PermissionModuleEnum";

@Entity("permissions")
export class Permission extends Tracking {
    @Column({ type: "enum", enum: PermissionActionEnum, nullable: false })
    PermissionAction!: PermissionActionEnum;

    @Column({ type: "enum", enum: PermissionModuleEnum, nullable: false })
    Module!: PermissionModuleEnum;

    @Column({ type: "varchar", length: 255, nullable: true })
    Description?: string;

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.Permission)
    RolePermissions!: Relation<RolePermission[]>;
}

export const PermissionColumns = new Map<string, { columnName: string; columnType: string }>([
    ["PermissionId", { columnName: "p.PermissionId", columnType: "string" }],
    ["PermissionName", { columnName: "p.PermissionName", columnType: "string" }],
    ["Module", { columnName: "p.Module", columnType: "string" }],
    ["Description", { columnName: "p.Description", columnType: "string" }],
]);

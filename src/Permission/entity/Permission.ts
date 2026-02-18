import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Tracking } from "../../common/entity/Tracking";
import { RolePermission } from "./RolePermission";

@Entity("permissions")
export class Permission extends Tracking {
    @PrimaryGeneratedColumn("uuid")
    PermissionId!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    PermissionName!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    Module?: string;

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

import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation } from "typeorm";
import { Role } from "./Role";
import { Permission } from "./Permission";

@Entity("role_permissions")
export class RolePermission {
    @PrimaryColumn({ type: "uuid" })
    RoleId!: string;

    @PrimaryColumn({ type: "uuid" })
    PermissionId!: string;

    @ManyToOne(() => Role, (role) => role.RolePermissions)
    @JoinColumn({ name: "RoleId" })
    Role!: Relation<Role>;

    @ManyToOne(() => Permission, (permission) => permission.RolePermissions)
    @JoinColumn({ name: "PermissionId" })
    Permission!: Relation<Permission>;
}

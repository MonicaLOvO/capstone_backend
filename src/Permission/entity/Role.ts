import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Tracking } from "../../common/entity/Tracking";
import { User } from "../../user/entity/User";
import { RolePermission } from "./RolePermission";

@Entity("roles")
export class Role extends Tracking {
    @PrimaryGeneratedColumn("uuid")
    RoleId!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    RoleName!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    Description?: string;

    @OneToMany(() => User, (user) => user.Role)
    Users!: Relation<User[]>;

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.Role)
    RolePermissions!: Relation<RolePermission[]>;
}

export const RoleColumns = new Map<string, { columnName: string; columnType: string }>([
    ["RoleId", { columnName: "r.RoleId", columnType: "string" }],
    ["RoleName", { columnName: "r.RoleName", columnType: "string" }],
    ["Description", { columnName: "r.Description", columnType: "string" }],
]);

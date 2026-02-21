import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Tracking } from "../../common/entity/Tracking";
import { Department } from "./Department";
import { Role } from "../../Permission/entity/Role";

@Entity("users")
export class User extends Tracking {
    @Column({ type: "varchar", length: 255, unique: true })
    Username!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    Email!: string;

    @Column({ type: "varchar", length: 255 })
    PasswordHash!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    FirstName?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    LastName?: string;

    @ManyToOne(() => Department, (department) => department.Users)
    @JoinColumn({ name: "DepartmentId" })
    Department?: Department;

    @ManyToOne(() => Role, (role) => role.Users)
    @JoinColumn({ name: "RoleId" })
    Role?: Role;

    @Column({ type: "boolean", default: true })
    IsActive!: boolean;
}

export const UserColumns = new Map<string, { columnName: string; columnType: string }>([
    ["Id", { columnName: "u.Id", columnType: "string" }],
    ["Username", { columnName: "u.Username", columnType: "string" }],
    ["Email", { columnName: "u.Email", columnType: "string" }],
    ["FirstName", { columnName: "u.FirstName", columnType: "string" }],
    ["LastName", { columnName: "u.LastName", columnType: "string" }],
    ["Department", { columnName: "u.DepartmentId", columnType: "string" }],
    ["Role", { columnName: "u.RoleId", columnType: "string" }],
    ["IsActive", { columnName: "u.IsActive", columnType: "boolean" }],
]);


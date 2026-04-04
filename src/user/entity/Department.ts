import { Column, Entity, OneToMany } from "typeorm";
import { Tracking } from "../../common/entity/Tracking";
import { User } from "./User";

@Entity("departments")
export class Department extends Tracking {
    @Column({ type: "varchar", length: 255, unique: true })
    DepartmentName!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    Description?: string;

    @Column({ type: "boolean", default: true })
    IsActive!: boolean;

    @OneToMany(() => User, (user) => user.Department)
    Users!: User[];
}

export const DepartmentColumns = new Map<string, { columnName: string; columnType: string }>([
    ["Id", { columnName: "d.Id", columnType: "string" }],
    ["DepartmentName", { columnName: "d.DepartmentName", columnType: "string" }],
    ["Description", { columnName: "d.Description", columnType: "string" }],
    ["IsActive", { columnName: "d.IsActive", columnType: "boolean" }],
]);

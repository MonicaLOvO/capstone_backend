import { Column, Entity, PrimaryGeneratedColumn  } from "typeorm";
import { Tracking } from "../../../common/entity/Tracking";

@Entity("injury_reports")
export class InjuryReport extends Tracking {
    @PrimaryGeneratedColumn("uuid")
    Id!: string;
    @Column({ type: "varchar", length: 255 })
    EmployeeName!: string;

    @Column({ type: "varchar", length: 255 })
    ReportedBy!: string;

    @Column({ type: "varchar", length: 255 })
    InjuryType!: string;

    @Column({ type: "text"})
    Description!: string;

    @Column({ type: "text", nullable: true })
    AdditionalNotes?: string;

    @Column({ type: "date" })
    ReportDate!: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    Location?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    Witnesses?: string;

}

export const InjuryReportColumns = new Map<string, { columnName: string; columnType: string }>([
    ["EmployeeName", { columnName: "ir.EmployeeName", columnType: "string" }],
    ["ReportedBy", { columnName: "ir.ReportedBy", columnType: "string" }],
    ["InjuryType", { columnName: "ir.InjuryType", columnType: "string" }],
    ["Description", { columnName: "ir.Description", columnType: "string" }],
    ["AdditionalNotes", { columnName: "ir.AdditionalNotes", columnType: "string" }],
    ["ReportDate", { columnName: "ir.ReportDate", columnType: "date" }],
    ["Location", { columnName: "ir.Location", columnType: "string" }],
    ["Witnesses", { columnName: "ir.Witnesses", columnType: "string" }],
]);
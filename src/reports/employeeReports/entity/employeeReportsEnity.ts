import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { Tracking } from "../../../common/entity/Tracking";
import { EmployeeReportTypeEnum } from "../enum/employeeReportEnum";

@Entity("employee_reports")
export class EmployeeReport extends Tracking {
  // Primary Key
  // @PrimaryGeneratedColumn("uuid")
  // id!: string;

  // Employee Info
 
  @Column({ type: "varchar", length: 255 })
  employeeId!: string;

  @Column({  type: "varchar", length: 255 })
  employeeName!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  department?: string;

  // Report Classification
  
  @Column({
    type: "enum",
    enum: EmployeeReportTypeEnum,
  })
  reportType!: EmployeeReportTypeEnum;

  @Column({  type: "date" })
  reportDate!: Date;

  @Column({  type: "varchar", length: 255 })
  reportedBy!: string;

  @Column({  type: "text" })
  description!: string;

  @Column({  type: "text", nullable: true })
  previousWarnings?: string;

  @Column({  type: "text", nullable: true })
  additionalNotes?: string;

  // Resolution
  @Column({  type: "text", nullable: true })
  actionTaken?: string;
}

export const EmployeeReportColumns = new Map<string, { columnName: string; columnType: string }>([
    ["EmployeeId", { columnName: "er.employeeId", columnType: "string" }], 
    ["EmployeeName", { columnName: "er.employeeName", columnType: "string" }],
    ["Department", { columnName: "er.department", columnType: "string" }],
    ["ReportType", { columnName: "er.reportType", columnType: "enum" }],
    ["ReportDate", { columnName: "er.reportDate", columnType: "date" }],
    ["ReportedBy", { columnName: "er.reportedBy", columnType: "string" }],
    ["Description", { columnName: "er.description", columnType: "string" }],
    ["PreviousWarnings", { columnName: "er.previousWarnings", columnType: "string" }],
    ["AdditionalNotes", { columnName: "er.additionalNotes", columnType: "string" }],
    ["ActionTaken", { columnName: "er.actionTaken", columnType: "string" }],
]);

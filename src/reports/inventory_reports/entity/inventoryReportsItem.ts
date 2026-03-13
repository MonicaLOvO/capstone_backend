import { Column, Entity, PrimaryGeneratedColumn  } from "typeorm";
import { Tracking } from "../../../common/entity/Tracking"; 
import { InventoryReportType } from "../enum/inventoryReportEnum";

@Entity("inventory_reports_items")
export class InventoryReportsItem extends Tracking {
    @PrimaryGeneratedColumn("uuid")
    Id!: string;

    @Column({ type: "varchar", length: 255 })
    ItemName!: string;

    @Column({type: "varchar", length: 255, nullable: false})
     reportedBy!: string;

    @Column({ type: "enum", enum: InventoryReportType })
    ReportType!: InventoryReportType;

    @Column({ type: "varchar", length: 255 })
    Description!: string;

    @Column({ type: "varchar" , length: 255 , nullable: true})
    AdditionalNotes?: string;

}

export const InventoryReportsItemColumns = new Map<string, {columnName: string, columnType: string}>([
    ["ItemName", {columnName: "iri.ItemName", columnType: "string"}],
    ["reportedBy", {columnName: "iri.reportedBy", columnType: "string"}],
    ["ReportType", {columnName: "iri.ReportType", columnType: "enum"}],
    ["Description", {columnName: "iri.Description", columnType: "string"}],
    ["AdditionalNotes", {columnName: "iri.AdditionalNotes", columnType: "string"}],
]);
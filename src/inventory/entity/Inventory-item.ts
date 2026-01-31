import { Column, Entity, Generated, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Tracking } from "../../common/entity/Tracking";
import { InventoryItemStatusEnum } from "../enum/InventoryItemStatusEnum";

@Entity("inventory_items")
export class InventoryItem extends Tracking {
    @PrimaryColumn({ type: "varchar", length: 36 })
    @Generated("uuid")
    Id!: string;

    @Column({ type: "varchar", length: 255 })
    ItemName!: string;

    @Column({ type: "varchar", length: 255 })
    Description!: string;

    @Column({ type: "int" , default: 0})
    Quantity!: number;

    @Column({ type: "decimal", precision: 10, scale: 2})
    UnitPrice!: number;

    @Column({ type: "varchar", length: 255 , nullable: true})
    QrCode?: string;

    @Column({ type: "varchar", length: 255 , nullable: true})
    ImageUrl?: string;

    @Column({ type: "varchar", length: 255 , nullable: true})
    Category?: string;

    @Column({ type: "varchar", length: 255 , nullable: true})
    Location?: string;

    @Column({ type: "varchar", length: 255 , unique: true})
    Sku!: string;

    @Column({ type: "enum", enum: InventoryItemStatusEnum })
    Status!: InventoryItemStatusEnum;
}

export const InventoryItemColumns = new Map<string, {columnName: string, columnType: string}>([
    ["ItemName", {columnName: "ii.ItemName", columnType: "string"}],
    ["Description", {columnName: "ii.Description", columnType: "string"}],
    ["Quantity", {columnName: "ii.Quantity", columnType: "number"}],
    ["UnitPrice", {columnName: "ii.UnitPrice", columnType: "number"}],
    ["QrCode", {columnName: "ii.QrCode", columnType: "string"}],
    ["ImageUrl", {columnName: "ii.ImageUrl", columnType: "string"}],
    ["Category", {columnName: "ii.Category", columnType: "string"}],
    ["Location", {columnName: "ii.Location", columnType: "string"}],
    ["Sku", {columnName: "ii.Sku", columnType: "string"}],
    ["Status", {columnName: "ii.Status", columnType: "enum"}],
]);
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tracking } from "../../common/entity/Tracking";
import { Order } from "./order";
import { InventoryItem } from "../../inventory/entity/Inventory-item";

@Entity("order_items")
export class OrderItem extends Tracking {

    @PrimaryGeneratedColumn("uuid")
    Id!: string;

    @Column({ type: "varchar", length: 255 })
    @ManyToOne(() => Order, (order) => order.OrderItems)
    Order!: Order;

    @Column({ type: "varchar", length: 255 })
    @ManyToOne(() => InventoryItem, (inventoryItem) => inventoryItem.OrderItems)
    InventoryItem!: InventoryItem;

    @Column({ type: "int", default: 1 })
    Quantity!: number;

}

export const OrderItemColumns = new Map<string, {columnName: string, columnType: string}>([
    ["Id", {columnName: "oi.Id", columnType: "string"}],
    ["OrderId", {columnName: "oi.OrderId", columnType: "string"}],
    ["InventoryItemId", {columnName: "oi.InventoryItemId", columnType: "string"}],
    ["Quantity", {columnName: "oi.Quantity", columnType: "number"}],
]);
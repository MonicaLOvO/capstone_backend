import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Tracking } from "../../common/entity/Tracking";
import { InventoryItem } from "../../inventory/entity/Inventory-item";
import { Order } from "./Order";

@Entity("order_items")
export class OrderItem extends Tracking {

    @ManyToOne(() => Order, (order) => order.OrderItems)
    @JoinColumn({ name: "OrderId" })
    Order!: Order;

    @ManyToOne(() => InventoryItem, (inventoryItem) => inventoryItem.OrderItems)
    @JoinColumn({ name: "InventoryItemId" })
    InventoryItem!: InventoryItem;

    @Column({ type: "int", default: 1 })
    Quantity!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    UnitPrice!: number;

}

export const OrderItemColumns = new Map<string, {columnName: string, columnType: string}>([
    ["Id", {columnName: "oi.Id", columnType: "string"}],
    ["OrderId", {columnName: "oi.OrderId", columnType: "string"}],
    ["InventoryItemId", {columnName: "oi.InventoryItemId", columnType: "string"}],
    ["Quantity", {columnName: "oi.Quantity", columnType: "number"}],
    ["UnitPrice", {columnName: "oi.UnitPrice", columnType: "number"}],
]);
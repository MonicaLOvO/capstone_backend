import { Column, Entity, OneToMany } from "typeorm";
import { Tracking } from "../../common/entity/Tracking";
import { OrderStatusEnum } from "../enum/OrderStatusEnum";
import { OrderItem } from "./OrderItem";

@Entity("orders")
export class Order extends Tracking {

    @Column({ type: "varchar", length: 255, nullable: true })
    OrderType?: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    OrderDate!: Date;

    @Column({ type: "enum", enum: OrderStatusEnum, default: OrderStatusEnum.Pending })
    OrderStatus!: OrderStatusEnum;

    @Column({ type: "datetime", nullable: true })
    OrderCompletedDate?: Date;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.Order, { cascade: ["insert", "update"] })
    OrderItems!: OrderItem[];

    //CustomerId if needed
}

export const OrderColumns = new Map<string, {columnName: string, columnType: string}>([
    ["Id", {columnName: "o.Id", columnType: "string"}],
    ["OrderType", {columnName: "o.OrderType", columnType: "string"}],
    ["OrderDate", {columnName: "o.OrderDate", columnType: "datetime"}],
    ["OrderStatus", {columnName: "o.OrderStatus", columnType: "enum"}],
    ["OrderCompletedDate", {columnName: "o.OrderCompletedDate", columnType: "datetime"}],
    ["OrderItemsId", {columnName: "o.OrderItemsId", columnType: "array"}],
]);
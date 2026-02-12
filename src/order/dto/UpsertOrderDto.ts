
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { OrderStatusEnum } from "../enum/OrderStatusEnum";
import { UpsertOrderItemDto } from "./UpsertOrderItemDto";

export class OrderDto {

    @IsString()
    @IsOptional()
    Id?: string;

    @IsString()
    @IsOptional()
    OrderType?: string;

    @IsDate()
    @IsOptional()
    OrderDate?: Date;

    @IsEnum(OrderStatusEnum)
    @IsNotEmpty({ message: "OrderStatus is required" }) 
    OrderStatus!: OrderStatusEnum;

    @IsDate()
    @IsOptional()
    OrderCompletedDate?: Date;

    @IsArray()
    @IsOptional()
    OrderItems?: UpsertOrderItemDto[];

}

import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { OrderStatusEnum } from "../enum/OrderStatusEnum";
import { OrderItem } from "../entity/OrderItem";

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
    @IsOptional()
    Status?: OrderStatusEnum;

    @IsDate()
    @IsOptional()
    OrderCompletedDate?: Date;

    @IsArray()
    @IsOptional()
    OrderItemsId?: OrderItem[];

    @IsNumber()
    @IsOptional()
    TotalPrice?: number;

}
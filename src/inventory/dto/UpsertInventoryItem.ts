import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { InventoryItemStatusEnum } from "../enum/InventoryItemStatusEnum";
import { OrderItem } from "../../order/entity/OrderItem";

export class UpsertInventoryItemDto {

    @IsString()
    @IsOptional()
    Id?: string;

    @IsString()
    @IsOptional()
    ProductName?: string;

    @IsString()
    @IsOptional()
    Description?: string;

    @IsNumber()
    @IsOptional()
    Quantity?: number;

    @IsNumber()
    @IsOptional()
    UnitPrice?: number;

    @IsString()
    @IsOptional()
    QrCodeValue?: string;

    @IsString()
    @IsOptional()
    ImageUrl?: string;

    @IsString()
    @IsOptional()
    Category?: string;

    @IsString()
    @IsOptional()
    Location?: string;

    @IsString()
    @IsOptional()
    Sku?: string;

    @IsEnum(InventoryItemStatusEnum)
    @IsOptional()
    Status?: InventoryItemStatusEnum;

    @IsArray()
    @IsOptional()
    OrdersId?: OrderItem[];
}
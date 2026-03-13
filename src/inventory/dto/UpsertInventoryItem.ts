import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { InventoryItemStatusEnum } from "../enum/InventoryItemStatusEnum";
import { OrderItem } from "../../order/entity/OrderItem";
import { Type } from "class-transformer/types/decorators/type.decorator";

export class UpsertInventoryItemDto {

    @IsString({ message: "Id must be a text" })
    @IsOptional()
    Id?: string;

    @IsString({ message: "Product name must be a text format" })
    @IsNotEmpty({ message: "Product name is required" })

    ProductName?: string;

    @IsString({ message: "Description must be a text format" })
    @IsOptional()
    Description?: string;


    @Type(() => Number)
    @IsNumber({}, { message: "Quantity must be a number" })
    @Min(0, { message: "Quantity cannot be less than 0" })
    @IsOptional()
    Quantity?: number;

    @Type(() => Number)
    @IsNumber({}, { message: "Unit price must be a number" })
    @Min(0, { message: "Unit price cannot be less than 0" })
    
    UnitPrice?: number;

    @IsString({ message: "Category must be a text format" })
    @IsOptional()
    Category?: string;

    @IsString({ message: "Location must be a text format" })
    @IsOptional()
    Location?: string;

    @IsString({ message: "SKU must be a text format" })
    @IsOptional()
    Sku?: string;

    @Type(() => Number)
    @IsNumber({}, { message: "Lowest stock level must be a number" })
    @Min(0, { message: "Lowest stock level cannot be less than 0" })
    @IsOptional()
    LowestStockLevel?: number;

    @IsEnum(InventoryItemStatusEnum , { message: "Status must be a valid enum value" })
    @IsOptional()
    Status?: InventoryItemStatusEnum;

    @IsArray()
    @IsOptional()
    OrdersId?: OrderItem[];
}
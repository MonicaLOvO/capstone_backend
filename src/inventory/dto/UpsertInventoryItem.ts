import { Transform, Type } from "class-transformer";
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  Max
} from "class-validator";
import { InventoryItemStatusEnum } from "../enum/InventoryItemStatusEnum";

export class UpsertInventoryItemDto {
  @IsOptional()
  @IsUUID("4", { message: "Id must be a valid UUID." })
  Id?: string;

  @IsOptional()
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "ProductName must be a string." })
  @MaxLength(150, { message: "ProductName cannot exceed 150 characters." })
  ProductName?: string;

  @IsOptional()
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "Description must be a string." })
  @MaxLength(1000, { message: "Description cannot exceed 1000 characters." })
  Description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "Quantity must be a whole number." })
  @Min(0, { message: "Quantity cannot be less than 0." })
  @Max(1000000, { message: "Quantity cannot exceed 1,000,000." })
  Quantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "UnitPrice must be a valid number with at most 2 decimal places." }
  )
  @Min(0, { message: "UnitPrice cannot be less than 0." })
  UnitPrice?: number;

  @IsOptional()
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "Category must be a string." })
  @MaxLength(100, { message: "Category cannot exceed 100 characters." })
  Category?: string;

  @IsOptional()
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "Location must be a string." })
  @MaxLength(100, { message: "Location cannot exceed 100 characters." })
  Location?: string;

  @IsOptional()
  @Transform(({ value }) => typeof value === "string" ? value.trim().toUpperCase() : value)
  @IsString({ message: "Sku must be a string." })
  @MaxLength(50, { message: "Sku cannot exceed 50 characters." })
  Sku?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "LowestStockLevel must be a whole number." })
  @Min(0, { message: "LowestStockLevel cannot be less than 0." })
  LowestStockLevel?: number;

  @IsOptional()
  @IsEnum(InventoryItemStatusEnum, {
    message: `Status must be one of: ${Object.values(InventoryItemStatusEnum).join(", ")}.`
  })
  Status?: InventoryItemStatusEnum;

  @IsOptional()
  @IsArray({ message: "OrdersId must be an array." })
  @ArrayUnique({ message: "OrdersId must not contain duplicate values." })
  @IsUUID("4", { each: true, message: "Each OrdersId value must be a valid UUID." })
  OrdersId?: string[];
}
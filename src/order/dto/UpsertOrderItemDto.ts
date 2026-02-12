import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpsertOrderItemDto {

    @IsString()
    @IsOptional()
    Id?: string;

    @IsString()
    @IsOptional()
    OrderId?: string;

    @IsString()
    @IsNotEmpty({ message: "InventoryItemId is required" })
    InventoryItemId!: string;

    @IsNumber()
    @IsOptional()
    Quantity?: number;
}

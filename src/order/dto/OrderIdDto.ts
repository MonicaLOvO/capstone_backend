import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class OrderIdDto {

    @IsString()
    @IsNotEmpty()
    Id!: string;

    @IsString()
    @IsNotEmpty()
    OrderId!: string;

    @IsString()
    @IsNotEmpty()
    InventoryItemId!: string;

    @IsNumber()
    @IsNotEmpty()
    Quantity!: number;
    
}

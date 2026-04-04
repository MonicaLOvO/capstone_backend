import { IsString } from "class-validator";

export class LoginDto {
    @IsString()
    Username!: string;

    @IsString()
    Password!: string;
}

import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put } from "routing-controllers";
import { UserModel } from "../model/UserModel";
import { IUserService } from "../service/interface/IUserService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { UpsertUserDto } from "../dto/UpsertUser";
import { SignUpDto } from "../dto/SignUpDto";
import { LoginDto } from "../dto/LoginDto";
import { PaginatedDataRespondModel } from "../../common/model/PaginatedDataRespondModel";

@JsonController("/api/user")
@injectable()
export class UserController {
    constructor(
        @inject(IUserService.name) private readonly userService: IUserService
    ) {}

    @Post("/signup")
    async signUp(@Body() dto: SignUpDto) {
        try {
            const userId = await this.userService.SignUp(dto);
            return new DataRespondModel<string>(userId, "User registered successfully");
        } catch (error: any) {
            const response = new DataRespondModel<string>(null, error.message);
            response.Success = false;
            return response;
        }
    }

    @Post("/login")
    async login(@Body() dto: LoginDto) {
        try {
            const result = await this.userService.Login(dto);
            return new DataRespondModel<{ token: string; user: UserModel }>(result, "Login successful");
        } catch (error: any) {
            const response = new DataRespondModel<string>(null, error.message);
            response.Success = false;
            return response;
        }
    }

    @Get("/list")
    async getUsers(@QueryParams() query: Record<string, string>) {
        const [data, total] = await this.userService.GetUsers(query);
        return new PaginatedDataRespondModel<UserModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/:id")
    async getUserById(@Param("id") id: string) {
        const data = await this.userService.GetUserById(id);
        return new DataRespondModel<UserModel>(data);
    }

    @Post("")
    async createUser(@Body() dto: UpsertUserDto) {
        const data = await this.userService.CreateUser(dto);
        return new DataRespondModel<string>(data);
    }

    @Put("/:id")
    async updateUser(@Param("id") id: string, @Body() dto: UpsertUserDto) {
        dto.UserId = id;
        const data = await this.userService.UpdateUser(dto);
        return new DataRespondModel<string>(data);
    }

    @Delete("/:id")
    async deleteUser(@Param("id") id: string) {
        const data = await this.userService.DeleteUser(id);
        return new DataRespondModel<string>(data);
    }
}

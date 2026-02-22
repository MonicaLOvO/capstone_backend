import { JsonController, Get, Param, QueryParams, Post, Body, Delete, Put } from "routing-controllers";
import { UserModel } from "../model/UserModel";
import { IUserService } from "../service/interface/IUserService";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { UpsertUserDto } from "../dto/UpsertUser";
import { SignUpDto } from "../dto/SignUpDto";
import { LoginDto } from "../dto/LoginDto";
import { PaginatedDataRespondModel } from "../../common/model/PaginatedDataRespondModel";
import { AndPermission } from "../../common/decorator/PermissionDecorator";
import { PermissionModuleEnum } from "../../Permission/enum/PermissionModuleEnum";
import { PermissionActionEnum } from "../../Permission/enum/PermissionActionEnum";

@JsonController("/api/user")
@injectable()
export class UserController {
    constructor(
        @inject(IUserService.name) private readonly userService: IUserService
    ) {
        console.log("UserController constructor", IUserService.name);
    }

    @Post("/signup")
    async signUp(@Body() dto: SignUpDto) {
        const userId = await this.userService.SignUp(dto);
        return new DataRespondModel<string>(userId, "User registered successfully");
    }

    @Post("/login")
    async login(@Body() dto: LoginDto) {
        const result = await this.userService.Login(dto);
        return new DataRespondModel<{ token: string; user: UserModel }>(result, "Login successful");
    }

    @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.VIEW)
    @Get("/list")
    async getUsers(@QueryParams() query: Record<string, string>) {
        const [data, total] = await this.userService.GetUsers(query);
        return new PaginatedDataRespondModel<UserModel[]>(data, total, query["Page"], query["PageSize"]);
    }

    @Get("/current")
    async getCurrentUser() {
        const data = await this.userService.GetCurrentUser();
        return new DataRespondModel<UserModel>(data, "Current user retrieved successfully");
    }

    @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.READ)
    @Get("/:id")
    async getUserById(@Param("id") id: string) {
        const data = await this.userService.GetUserById(id);
        return new DataRespondModel<UserModel>(data);
    }

    @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.CREATE)
    @Post("")
    async createUser(@Body() dto: UpsertUserDto) {
        const data = await this.userService.CreateUser(dto);
        return new DataRespondModel<string>(data);
    }

    @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.UPDATE)
    @Put("/:id")
    async updateUser(@Param("id") id: string, @Body() dto: UpsertUserDto) {
        dto.Id = id;
        const data = await this.userService.UpdateUser(dto);
        return new DataRespondModel<string>(data);
    }

    @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.DELETE)
    @Delete("/:id")
    async deleteUser(@Param("id") id: string) {
        const data = await this.userService.DeleteUser(id);
        return new DataRespondModel<string>(data);
    }
}

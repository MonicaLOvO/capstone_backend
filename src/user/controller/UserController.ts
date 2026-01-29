import { injectable, inject } from "tsyringe";
import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  OnUndefined,
  QueryParam,
} from "routing-controllers";
import { UserService, IUserService } from "../service/UserService";
import { User } from "../entity/User";

@JsonController("/api/users")
@injectable()
export class UserController {
  constructor(
    @inject("IUserService") private userService: IUserService
  ) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      throw new Error("Failed to fetch users");
    }
  }

  @Get("/:id")
  async getUserById(@Param("id") id: number, @QueryParam("email") email: string): Promise<User> {
    if (isNaN(id)) {
      throw new Error("Invalid user ID");
    }

    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() body: { name: string; email: string }): Promise<User> {
    const { name, email } = body;

    if (!name || !email) {
      throw new Error("Name and email are required");
    }

    try {
      return await this.userService.createUser({ name, email });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create user";
      throw new Error(errorMessage);
    }
  }

  @Put("/:id")
  async updateUser(
    @Param("id") id: number,
    @Body() body: Partial<User>
  ): Promise<User> {
    if (isNaN(id)) {
      throw new Error("Invalid user ID");
    }

    const user = await this.userService.updateUser(id, body);
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  @Delete("/:id")
  @HttpCode(204)
  @OnUndefined(204)
  async deleteUser(@Param("id") id: number): Promise<void> {
    if (isNaN(id)) {
      throw new Error("Invalid user ID");
    }

    const deleted = await this.userService.deleteUser(id);
    if (!deleted) {
      throw new Error("User not found");
    }
  }
}


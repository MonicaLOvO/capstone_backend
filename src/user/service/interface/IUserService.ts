import { UpsertUserDto } from "../../dto/UpsertUser";
import { SignUpDto } from "../../dto/SignUpDto";
import { LoginDto } from "../../dto/LoginDto";
import { UserModel } from "../../model/UserModel";

export abstract class IUserService {
    abstract GetUsers(query?: Record<string, string>): Promise<[UserModel[], number]>;
    abstract GetUserById(id: string): Promise<UserModel | null>;
    abstract GetCurrentUser(): Promise<UserModel | null>;
    abstract CreateUser(dto: UpsertUserDto): Promise<string>;
    abstract UpdateUser(dto: UpsertUserDto): Promise<string>;
    abstract DeleteUser(id: string): Promise<string>;
    abstract SignUp(dto: SignUpDto): Promise<string>;
    abstract Login(dto: LoginDto): Promise<{ token: string; user: UserModel }>;
}

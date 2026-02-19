import { inject, injectable } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { IUserService } from "../interface/IUserService";
import { UserRepository } from "../../repository/UserRepository";
import { IUserMapperService } from "../interface/mapper/IUserMapperService";
import { UserModel } from "../../model/UserModel";
import { UpsertUserDto } from "../../dto/UpsertUser";
import { SignUpDto } from "../../dto/SignUpDto";
import { LoginDto } from "../../dto/LoginDto";
import { User } from "../../entity/User";

export { IUserService };

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "capstone-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

@injectable()
export class UserService extends IUserService {
  constructor(
    @inject(IUserMapperService.name) private readonly mapper: IUserMapperService,
    @inject(UserRepository) private readonly userRepository: UserRepository
  ) {
    super();
  }

  async GetUsers(query?: Record<string, string>): Promise<[UserModel[], number]> {
    const entities = await this.userRepository.GetUsers(query) as User[];
    const total = await this.userRepository.GetUsers(query, true) as number;
    const models = entities.map(entity => this.mapper.MapEntityToModel(entity));
    return [models, total];
  }

  async GetUserById(id: string): Promise<UserModel | null> {
    const entity = await this.userRepository.GetUserById(id);
    return entity ? this.mapper.MapEntityToModel(entity) : null;
  }

  async CreateUser(dto: UpsertUserDto): Promise<string> {
    const passwordHash = dto.Password
      ? await bcrypt.hash(dto.Password, SALT_ROUNDS)
      : await bcrypt.hash("default123", SALT_ROUNDS);

    const userData: Partial<User> = {
      Username: dto.Username ?? "",
      Email: dto.Email ?? "",
      PasswordHash: passwordHash,
      IsActive: dto.IsActive ?? true,
    };
    if (dto.FirstName) userData.FirstName = dto.FirstName;
    if (dto.LastName) userData.LastName = dto.LastName;
    if (dto.DepartmentId) userData.Department = { DepartmentId: dto.DepartmentId } as any;
    if (dto.RoleId) userData.Role = { RoleId: dto.RoleId } as any;

    const user = await this.userRepository.AddUser(userData);
    return user.UserId;
  }

  async UpdateUser(dto: UpsertUserDto): Promise<string> {
    let passwordHash: string | undefined;
    if (dto.Password) {
      passwordHash = await bcrypt.hash(dto.Password, SALT_ROUNDS);
    }

    const updatedId = await this.userRepository.UpdateUser(dto, passwordHash);
    if (!updatedId) {
      throw new Error("Failed to update user");
    }
    return updatedId;
  }

  async DeleteUser(id: string): Promise<string> {
    const deletedId = await this.userRepository.DeleteUser(id);
    if (!deletedId) {
      throw new Error("Failed to delete user");
    }
    return deletedId;
  }

  async SignUp(dto: SignUpDto): Promise<string> {
    const existingByUsername = await this.userRepository.GetUserByUsername(dto.Username);
    if (existingByUsername) {
      throw new Error("Username already exists");
    }

    const existingByEmail = await this.userRepository.GetUserByEmail(dto.Email);
    if (existingByEmail) {
      throw new Error("Email already exists");
    }

    const passwordHash = await bcrypt.hash(dto.Password, SALT_ROUNDS);

    const userData: Partial<User> = {
      Username: dto.Username,
      Email: dto.Email,
      PasswordHash: passwordHash,
      IsActive: true,
    };
    if (dto.FirstName) userData.FirstName = dto.FirstName;
    if (dto.LastName) userData.LastName = dto.LastName;
    if (dto.DepartmentId) userData.Department = { DepartmentId: dto.DepartmentId } as any;
    if (dto.RoleId) userData.Role = { RoleId: dto.RoleId } as any;

    const user = await this.userRepository.AddUser(userData);

    return user.UserId;
  }

  async Login(dto: LoginDto): Promise<{ token: string; user: UserModel }> {
    const user = await this.userRepository.GetUserByUsername(dto.Username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    if (!user.IsActive) {
      throw new Error("Account is deactivated");
    }

    const isPasswordValid = await bcrypt.compare(dto.Password, user.PasswordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    const signOptions: SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
    const token = jwt.sign(
      {
        userId: user.UserId,
        username: user.Username,
        email: user.Email,
        roleId: user.Role?.RoleId,
        roleName: user.Role?.RoleName,
      },
      JWT_SECRET,
      signOptions
    );

    const userModel = this.mapper.MapEntityToModel(user);
    return { token, user: userModel };
  }
}

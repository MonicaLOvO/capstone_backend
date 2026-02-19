import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User, UserColumns } from "../entity/User";
import { UpsertUserDto } from "../dto/UpsertUser";
import { RepositoryHelper } from "../../common/helper/RepositoryHelper";

@injectable()
export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async GetUsers(queryParams?: Record<string, string>, getTotal: boolean = false): Promise<User[] | number> {
    const filterResult = RepositoryHelper.generateFilter(queryParams ?? {}, UserColumns);

    const query = this.repository.createQueryBuilder("u")
      .leftJoinAndSelect("u.Department", "department")
      .leftJoinAndSelect("u.Role", "role")
      .where("u.DeletedAt IS NULL");

    if (filterResult.Filter.length > 0) {
      for (const filter of filterResult.Filter) {
        query.andWhere(filter.FilterString, filter.FilterValues);
      }
    }

    if (!getTotal && filterResult.OrderBy && filterResult.OrderBy.OrderByString) {
      query.orderBy(filterResult.OrderBy.OrderByString ?? "", filterResult.OrderBy.OrderByDirection ?? "ASC");
    }

    if (!getTotal && filterResult.Pagination && filterResult.Pagination.Page && filterResult.Pagination.PageSize) {
      query.skip((filterResult.Pagination.Page - 1) * filterResult.Pagination.PageSize);
      query.take(filterResult.Pagination.PageSize);
    }

    if (getTotal) {
      return await query.getCount();
    } else {
      return await query.getMany();
    }
  }

  async GetUserById(id: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { UserId: id, DeletedAt: IsNull() },
      relations: ["Department", "Role"],
    });
  }

  async GetUserByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { Username: username, DeletedAt: IsNull() },
      relations: ["Department", "Role"],
    });
  }

  async GetUserByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { Email: email, DeletedAt: IsNull() },
      relations: ["Department", "Role"],
    });
  }

  async AddUser(userData: Partial<User>): Promise<User> {
    const newUser = this.repository.create(userData);
    return await this.repository.save(newUser);
  }

  async UpdateUser(dto: UpsertUserDto, passwordHash?: string): Promise<string> {
    const target = await this.repository.findOne({ where: { UserId: dto.UserId ?? "", DeletedAt: IsNull() } });
    if (!target) {
      throw new Error("User not found");
    }

    target.Username = dto.Username ?? target.Username;
    target.Email = dto.Email ?? target.Email;
    if (dto.FirstName !== undefined) target.FirstName = dto.FirstName;
    if (dto.LastName !== undefined) target.LastName = dto.LastName;
    target.IsActive = dto.IsActive ?? target.IsActive;

    if (passwordHash) {
      target.PasswordHash = passwordHash;
    }

    if (dto.DepartmentId) {
      target.Department = { DepartmentId: dto.DepartmentId } as any;
    }

    if (dto.RoleId) {
      target.Role = { RoleId: dto.RoleId } as any;
    }

    const result = await this.repository.save(target);
    return result.UserId;
  }

  async DeleteUser(id: string): Promise<string> {
    const target = await this.repository.findOne({ where: { UserId: id, DeletedAt: IsNull() } });
    if (!target) {
      throw new Error("User not found");
    }

    target.DeletedAt = new Date();
    const result = await this.repository.save(target);
    return result.UserId;
  }
}

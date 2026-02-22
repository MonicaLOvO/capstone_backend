import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User, UserColumns } from "../entity/User";
import { UpsertUserDto } from "../dto/UpsertUser";
import { RepositoryHelper } from "../../common/helper/RepositoryHelper";
import { RequestContext } from "../../common/context/RequestContext";
import { Department } from "../entity/Department";
import { Role } from "../../Permission/entity/Role";

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
      .leftJoinAndSelect("u.Role", "role", "role.DeletedAt IS NULL")
      // .leftJoinAndSelect("role.RolePermissions", "rolePermissions")
      // .leftJoinAndSelect("rolePermissions.Permission", "permission", "permission.DeletedAt IS NULL")
      .where("u.DeletedAt IS NULL");

    if (filterResult.Filter.length > 0) {
      for (const filter of filterResult.Filter) {
        query.andWhere(filter.FilterString, filter.FilterValues);
      }
    }

    if(queryParams?.["DepartmentName"]) {
      query.andWhere("department.DepartmentName LIKE :departmentName", { departmentName: `%${queryParams?.["DepartmentName"] ?? ""}%` });
    }
    if(queryParams?.["RoleName"]) {
      query.andWhere("role.RoleName LIKE :roleName", { roleName: `%${queryParams?.["RoleName"] ?? ""}%` });
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
      where: { Id: id, DeletedAt: IsNull() },
      relations: ["Department", "Role", "Role.RolePermissions", "Role.RolePermissions.Permission"],
    });
  }

  async GetUserByUsername(username: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { Username: username, DeletedAt: IsNull() },
      relations: ["Department", "Role", "Role.RolePermissions", "Role.RolePermissions.Permission"],
    });
  }

  async GetUserByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { Email: email, DeletedAt: IsNull() },
      relations: ["Department", "Role", "Role.RolePermissions", "Role.RolePermissions.Permission"],
    });
  }

  async AddUser(userData: Partial<User>): Promise<User> {
    const context = RequestContext.currentOrFail();
    const newUser = this.repository.create(userData);
    newUser.CreatedBy = context.userId ?? "";
    newUser.UpdatedBy = context.userId ?? "";

    return await this.repository.save(newUser);
  }

  async UpdateUser(dto: UpsertUserDto, passwordHash?: string): Promise<string> {
    const target = await this.repository.findOne({ where: { Id: dto.Id ?? "", DeletedAt: IsNull() } });
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
      target.Department = Object.assign<Department, Partial<Department>>({} as Department, { Id: dto.DepartmentId });
    }

    if (dto.RoleId) {
      target.Role = Object.assign<Role, Partial<Role>>({} as Role, { Id: dto.RoleId });
    }

    target.UpdatedBy = RequestContext.currentOrFail().userId ?? "";
    const result = await this.repository.save(target);
    return result.Id;
  }

  async DeleteUser(id: string): Promise<string> {
    const target = await this.repository.findOne({ where: { Id: id, DeletedAt: IsNull() } });
    if (!target) {
      throw new Error("User not found");
    }

    target.DeletedAt = new Date();
    target.UpdatedBy = RequestContext.currentOrFail().userId ?? "";
    const result = await this.repository.save(target);
    return result.Id;
  }
}

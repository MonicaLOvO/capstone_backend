import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Role, RoleColumns } from "../entity/Role";
import { UpsertRoleDto } from "../dto/UpsertRole";
import { RepositoryHelper } from "../../common/helper/RepositoryHelper";

@injectable()
export class RoleRepository {
  private repository: Repository<Role>;

  constructor() {
    this.repository = AppDataSource.getRepository(Role);
  }

  async GetRoles(queryParams?: Record<string, string>, getTotal: boolean = false): Promise<Role[] | number> {
    const filterResult = RepositoryHelper.generateFilter(queryParams ?? {}, RoleColumns);

    const query = this.repository.createQueryBuilder("r")
      .leftJoinAndSelect("r.RolePermissions", "rp")
      .leftJoinAndSelect("rp.Permission", "permission")
      .where("r.DeletedAt IS NULL");

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

  async GetRoleById(id: string): Promise<Role | null> {
    return await this.repository.findOne({
      where: { RoleId: id, DeletedAt: IsNull() },
      relations: ["RolePermissions", "RolePermissions.Permission"],
    });
  }

  async AddRole(dto: UpsertRoleDto): Promise<string> {
    const newItem = this.repository.create({
      RoleName: dto.RoleName ?? "",
    });
    if (dto.Description !== undefined) newItem.Description = dto.Description;

    const result = await this.repository.save(newItem);
    return result?.RoleId ?? "";
  }

  async UpdateRole(dto: UpsertRoleDto): Promise<string> {
    const target = await this.repository.findOne({ where: { RoleId: dto.RoleId ?? "", DeletedAt: IsNull() } });
    if (!target) {
      throw new Error("Role not found");
    }

    target.RoleName = dto.RoleName ?? target.RoleName;
    if (dto.Description !== undefined) target.Description = dto.Description;

    const result = await this.repository.save(target);
    return result.RoleId;
  }

  async DeleteRole(id: string): Promise<string> {
    const target = await this.repository.findOne({ where: { RoleId: id, DeletedAt: IsNull() } });
    if (!target) {
      throw new Error("Role not found");
    }

    target.DeletedAt = new Date();
    const result = await this.repository.save(target);
    return result.RoleId;
  }
}

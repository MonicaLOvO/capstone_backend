import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { RolePermission, RolePermissionColumns } from "../entity/RolePermission";
import { RepositoryHelper } from "../../common/helper/RepositoryHelper";

@injectable()
export class RolePermissionRepository {
  private repository: Repository<RolePermission>;

  constructor() {
    this.repository = AppDataSource.getRepository(RolePermission);
  }

  async GetPermissionsByRoleId(roleId: string, queryParams?: Record<string, string>, getTotal: boolean = false): Promise<RolePermission[] | number> {
    const filterResult = RepositoryHelper.generateFilter(queryParams ?? {}, RolePermissionColumns);

    const query = this.repository.createQueryBuilder("rp")
      .leftJoinAndSelect("rp.Permission", "permission")
      .where("rp.RoleId = :roleId", { roleId })
      .andWhere("(rp.ExpiresAt IS NULL OR rp.ExpiresAt > :now)", { now: new Date() });

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

  async GetRolesByPermissionId(permissionId: string): Promise<RolePermission[]> {
    return await this.repository.find({
      where: { PermissionId: permissionId },
      relations: ["Role"],
    });
  }

  async AddRolePermission(roleId: string, permissionId: string, expiresAt?: Date): Promise<RolePermission> {
    const existing = await this.repository.findOne({
      where: { RoleId: roleId, PermissionId: permissionId },
    });
    if (existing) {
      throw new Error("This permission is already assigned to the role");
    }

    const entry = this.repository.create({ RoleId: roleId, PermissionId: permissionId });
    if (expiresAt) entry.ExpiresAt = expiresAt;
    return await this.repository.save(entry);
  }

  async AddBulkRolePermissions(roleId: string, permissionIds: string[], expiresAt?: Date): Promise<number> {
    const existing = await this.repository.find({ where: { RoleId: roleId } });
    const existingSet = new Set(existing.map(e => e.PermissionId));

    const newEntries = permissionIds
      .filter(id => !existingSet.has(id))
      .map(id => {
        const entry = this.repository.create({ RoleId: roleId, PermissionId: id });
        if (expiresAt) entry.ExpiresAt = expiresAt;
        return entry;
      });

    if (newEntries.length === 0) return 0;
    const saved = await this.repository.save(newEntries);
    return saved.length;
  }

  async RemoveRolePermission(roleId: string, permissionId: string): Promise<void> {
    const target = await this.repository.findOne({
      where: { RoleId: roleId, PermissionId: permissionId },
    });
    if (!target) {
      throw new Error("Role-permission assignment not found");
    }
    await this.repository.remove(target);
  }

  async RemoveAllPermissionsFromRole(roleId: string): Promise<number> {
    const targets = await this.repository.find({ where: { RoleId: roleId } });
    if (targets.length === 0) return 0;
    await this.repository.remove(targets);
    return targets.length;
  }

  async ReplaceRolePermissions(roleId: string, permissionIds: string[], expiresAt?: Date): Promise<number> {
    const existing = await this.repository.find({ where: { RoleId: roleId } });
    if (existing.length > 0) {
      await this.repository.remove(existing);
    }

    const newEntries = permissionIds.map(id => {
      const entry = this.repository.create({ RoleId: roleId, PermissionId: id });
      if (expiresAt) entry.ExpiresAt = expiresAt;
      return entry;
    });

    if (newEntries.length === 0) return 0;
    const saved = await this.repository.save(newEntries);
    return saved.length;
  }
}

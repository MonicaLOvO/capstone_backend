import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Permission, PermissionColumns } from "../entity/Permission";
import { UpsertPermissionDto } from "../dto/UpsertPermission";
import { RepositoryHelper } from "../../common/helper/RepositoryHelper";

@injectable()
export class PermissionRepository {
  private repository: Repository<Permission>;

  constructor() {
    this.repository = AppDataSource.getRepository(Permission);
  }

  async GetPermissions(queryParams?: Record<string, string>, getTotal: boolean = false): Promise<Permission[] | number> {
    const filterResult = RepositoryHelper.generateFilter(queryParams ?? {}, PermissionColumns);

    const query = this.repository.createQueryBuilder("p")
      .where("p.DeletedAt IS NULL");

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

  async GetPermissionById(id: string): Promise<Permission | null> {
    return await this.repository.findOne({
      where: { Id: id, DeletedAt: IsNull() },
    });
  }

  // async AddPermission(dto: UpsertPermissionDto): Promise<string> {
  //   const newItem = this.repository.create({
  //     PermissionName: dto.PermissionName ?? "",
  //   });
  //   if (dto.Module !== undefined) newItem.Module = dto.Module;
  //   if (dto.Description !== undefined) newItem.Description = dto.Description;

  //   const result = await this.repository.save(newItem);
  //   return result?.PermissionId ?? "";
  // }

  // async UpdatePermission(dto: UpsertPermissionDto): Promise<string> {
  //   const target = await this.repository.findOne({ where: { Id: dto.PermissionId ?? "", DeletedAt: IsNull() } });
  //   if (!target) {
  //     throw new Error("Permission not found");
  //   }

  //   target.PermissionAction = dto.PermissionName ?? target.PermissionAction;
  //   if (dto.Module !== undefined) target.Module = dto.Module;
  //   if (dto.Description !== undefined) target.Description = dto.Description;

  //   const result = await this.repository.save(target);
  //   return result.Id;
  // }

  // async DeletePermission(id: string): Promise<string> {
  //   const target = await this.repository.findOne({ where: { Id: id, DeletedAt: IsNull() } });
  //   if (!target) {
  //     throw new Error("Permission not found");
  //   }

  //   target.DeletedAt = new Date();
  //   const result = await this.repository.save(target);
  //   return result.Id;
  // }
}

import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Department, DepartmentColumns } from "../entity/Department";
import { UpsertDepartmentDto } from "../dto/UpsertDepartment";
import { QueryFilterResult } from "../../common/model/QueryFilterResult";
import { RepositoryHelper } from "../../common/helper/RepositoryHelper";

@injectable()
export class DepartmentRepository {
  private repository: Repository<Department>;

  constructor() {
    this.repository = AppDataSource.getRepository(Department);
  }

  async GetDepartments(queryParams?: Record<string, string>, getTotal: boolean = false): Promise<Department[] | number> {
    const filterResult = RepositoryHelper.generateFilter(queryParams ?? {}, DepartmentColumns);

    const query = this.repository.createQueryBuilder("d")
      .where("d.DeletedAt IS NULL");

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

  async GetDepartmentById(id: string): Promise<Department | null> {
    return await this.repository.findOne({ where: { DepartmentId: id, DeletedAt: IsNull() } });
  }

  async AddDepartment(dto: UpsertDepartmentDto): Promise<string> {
    const newItem = this.repository.create({
      DepartmentName: dto.DepartmentName ?? "",
      Description: dto.Description ?? "",
      IsActive: dto.IsActive ?? true,
    });
    const result = await this.repository.save(newItem);
    return result?.DepartmentId ?? "";
  }

  async UpdateDepartment(dto: UpsertDepartmentDto): Promise<string> {
    const target = await this.repository.findOne({ where: { DepartmentId: dto.DepartmentId ?? "", DeletedAt: IsNull() } });
    if (!target) {
      throw new Error("Department not found");
    }

    target.DepartmentName = dto.DepartmentName ?? target.DepartmentName;
    if (dto.Description !== undefined) target.Description = dto.Description;
    target.IsActive = dto.IsActive ?? target.IsActive;

    const result = await this.repository.save(target);
    return result.DepartmentId;
  }

  async DeleteDepartment(id: string): Promise<string> {
    const target = await this.repository.findOne({ where: { DepartmentId: id, DeletedAt: IsNull() } });
    if (!target) {
      throw new Error("Department not found");
    }

    target.DeletedAt = new Date();
    const result = await this.repository.save(target);
    return result.DepartmentId;
  }
}

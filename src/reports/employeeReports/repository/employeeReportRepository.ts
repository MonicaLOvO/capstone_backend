import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { EmployeeReport, EmployeeReportColumns } from "../entity/employeeReportsEnity";
import { UpsertEmployeeReportDto } from "../dto/upsertEmployeeReportDto";
import { RepositoryHelper } from "../../../common/helper/RepositoryHelper";

@injectable()
export class EmployeeReportRepository {
  private repository: Repository<EmployeeReport>;

  constructor() {
    this.repository = AppDataSource.getRepository(EmployeeReport);
  }

  async GetEmployeeReports(
    queryParams?: Record<string, string>,
    getTotal?: false
  ): Promise<EmployeeReport[]>;

  async GetEmployeeReports(
    queryParams: Record<string, string> | undefined,
    getTotal: true
  ): Promise<number>;

  async GetEmployeeReports(
    queryParams?: Record<string, string>,
    getTotal: boolean = false
  ): Promise<EmployeeReport[] | number> {
    const filterResult = RepositoryHelper.generateFilter(
      queryParams ?? {},
      EmployeeReportColumns
    );

    const query = this.repository
      .createQueryBuilder("er")
      .where("er.DeletedAt IS NULL");

    if (filterResult.Filter.length > 0) {
      for (const filter of filterResult.Filter) {
        query.andWhere(filter.FilterString, filter.FilterValues);
      }
    }

    if (!getTotal && filterResult.OrderBy && filterResult.OrderBy.OrderByString) {
      query.orderBy(
        filterResult.OrderBy.OrderByString ?? "",
        filterResult.OrderBy.OrderByDirection ?? "ASC"
      );
    }

    if (
      !getTotal &&
      filterResult.Pagination &&
      filterResult.Pagination.Page &&
      filterResult.Pagination.PageSize
    ) {
      query.skip(
        (filterResult.Pagination.Page - 1) * filterResult.Pagination.PageSize
      );
      query.take(filterResult.Pagination.PageSize);
    }

    if (getTotal) {
      return await query.getCount();
    }

    return await query.getMany();
  }

  async GetEmployeeReportById(id: string): Promise<EmployeeReport | null> {
    return await this.repository.findOne({
      where: { Id: id, DeletedAt: IsNull() },
    });
  }

  async AddEmployeeReport(dto: UpsertEmployeeReportDto): Promise<string> {
    if (!dto.reportType) {
      throw new Error("reportType is required");
    }

    const newReport = this.repository.create({
      employeeId: dto.employeeId ?? "",
      employeeName: dto.employeeName ?? "",
      department: dto.department ?? "",
      reportType: dto.reportType,
      reportDate: dto.reportDate ? new Date(dto.reportDate) : new Date(),
      reportedBy: dto.reportedBy ?? "",
      description: dto.description ?? "",
      previousWarnings: dto.previousWarnings ?? "",
      additionalNotes: dto.additionalNotes ?? "",
      actionTaken: dto.actionTaken ?? "",
    });

    const result = await this.repository.save(newReport);
    return result?.Id ?? "";
  }

  async UpdateEmployeeReport(dto: UpsertEmployeeReportDto): Promise<string> {
    const target = await this.repository.findOne({
      where: { Id: dto.Id ?? "", DeletedAt: IsNull() },
    });

    if (!target) {
      throw new Error("Employee report not found");
    }

    Object.assign(target, {
      ...(dto.employeeId !== undefined ? { employeeId: dto.employeeId } : {}),
      ...(dto.employeeName !== undefined ? { employeeName: dto.employeeName } : {}),
      ...(dto.department !== undefined ? { department: dto.department } : {}),
      ...(dto.reportType !== undefined ? { reportType: dto.reportType } : {}),
      ...(dto.reportDate !== undefined ? { reportDate: new Date(dto.reportDate) } : {}),
      ...(dto.reportedBy !== undefined ? { reportedBy: dto.reportedBy } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.previousWarnings !== undefined ? { previousWarnings: dto.previousWarnings } : {}),
      ...(dto.additionalNotes !== undefined ? { additionalNotes: dto.additionalNotes } : {}),
      ...(dto.actionTaken !== undefined ? { actionTaken: dto.actionTaken } : {}),
    });

    const result = await this.repository.save(target);
    return result.Id;
  }

  async DeleteEmployeeReport(id: string): Promise<string> {
    const target = await this.repository.findOne({
      where: { Id: id, DeletedAt: IsNull() },
    });

    if (!target) {
      throw new Error("Employee report not found");
    }

    target.DeletedAt = new Date();
    const result = await this.repository.save(target);
    return result.Id;
  }
}

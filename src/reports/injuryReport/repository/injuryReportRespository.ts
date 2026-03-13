import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { InjuryReport, InjuryReportColumns } from "../entity/injuryReportEntity";
import { UpsertInjuryReportDto } from "../dto/upsertInjuryReportDto";
import { RepositoryHelper } from "../../../common/helper/RepositoryHelper";

@injectable()
export class InjuryReportRepository {
  private repository: Repository<InjuryReport>;

  constructor() {
    this.repository = AppDataSource.getRepository(InjuryReport);
  }

  async GetInjuryReports(
    queryParams?: Record<string, string>,
    getTotal?: false
  ): Promise<InjuryReport[]>;

  async GetInjuryReports(
    queryParams: Record<string, string> | undefined,
    getTotal: true
  ): Promise<number>;

  async GetInjuryReports(
    queryParams?: Record<string, string>,
    getTotal: boolean = false
  ): Promise<InjuryReport[] | number> {
    const filterResult = RepositoryHelper.generateFilter(
      queryParams ?? {},
      InjuryReportColumns
    );

    const query = this.repository
      .createQueryBuilder("ir")
      .where("ir.DeletedAt IS NULL");

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
    } else {
      return await query.getMany();
    }
  }

  async GetInjuryReportById(id: string): Promise<InjuryReport | null> {
    return await this.repository.findOne({
      where: { Id: id, DeletedAt: IsNull() },
    });
  }

  async AddInjuryReport(dto: UpsertInjuryReportDto): Promise<string> {
    const newReport = this.repository.create({
      EmployeeName: dto.employeeName ?? "",
      ReportedBy: dto.reportedBy ?? "",
      InjuryType: dto.injuryType ?? "",
      Description: dto.description ?? "",
      AdditionalNotes: dto.additionalNotes ?? "",
      ReportDate: dto.reportDate ? new Date(dto.reportDate) : new Date(),
      Location: dto.location ?? "",
      Witnesses: dto.witnesses ?? "",
    });

    const result = await this.repository.save(newReport);
    return result?.Id ?? "";
  }

  async UpdateInjuryReport(dto: UpsertInjuryReportDto): Promise<string> {
    const target = await this.repository.findOne({
      where: { Id: dto.id ?? "", DeletedAt: IsNull() },
    });

    if (!target) {
      throw new Error("Injury report not found");
    }

    Object.assign(target, {
      ...(dto.employeeName !== undefined ? { EmployeeName: dto.employeeName } : {}),
      ...(dto.reportedBy !== undefined ? { ReportedBy: dto.reportedBy } : {}),
      ...(dto.injuryType !== undefined ? { InjuryType: dto.injuryType } : {}),
      ...(dto.description !== undefined ? { Description: dto.description } : {}),
      ...(dto.additionalNotes !== undefined ? { AdditionalNotes: dto.additionalNotes } : {}),
      ...(dto.reportDate !== undefined ? { ReportDate: new Date(dto.reportDate) } : {}),
      ...(dto.location !== undefined ? { Location: dto.location } : {}),
      ...(dto.witnesses !== undefined ? { Witnesses: dto.witnesses } : {}),
    });

    const result = await this.repository.save(target);
    return result.Id;
  }

  async DeleteInjuryReport(id: string): Promise<string> {
    const target = await this.repository.findOne({
      where: { Id: id, DeletedAt: IsNull() },
    });

    if (!target) {
      throw new Error("Injury report not found");
    }

    target.DeletedAt = new Date();
    const result = await this.repository.save(target);
    return result.Id;
  }
}

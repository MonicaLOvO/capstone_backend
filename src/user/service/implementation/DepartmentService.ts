import { inject, injectable } from "tsyringe";
import { IDepartmentService } from "../interface/IDepartmentService";
import { DepartmentRepository } from "../../repository/DepartmentRepository";
import { IDepartmentMapperService } from "../interface/mapper/IDepartmentMapperService";
import { DepartmentModel } from "../../model/DepartmentModel";
import { UpsertDepartmentDto } from "../../dto/UpsertDepartment";
import { Department } from "../../entity/Department";

export { IDepartmentService };

@injectable()
export class DepartmentService extends IDepartmentService {
  constructor(
    @inject(IDepartmentMapperService.name) private readonly mapper: IDepartmentMapperService,
    @inject(DepartmentRepository) private readonly departmentRepository: DepartmentRepository
  ) {
    super();
  }

  async GetDepartments(query?: Record<string, string>): Promise<[DepartmentModel[], number]> {
    const entities = await this.departmentRepository.GetDepartments(query) as Department[];
    const total = await this.departmentRepository.GetDepartments(query, true) as number;
    const models = entities.map(entity => this.mapper.MapEntityToModel(entity));
    return [models, total];
  }

  async GetDepartmentById(id: string): Promise<DepartmentModel | null> {
    const entity = await this.departmentRepository.GetDepartmentById(id);
    return entity ? this.mapper.MapEntityToModel(entity) : null;
  }

  async CreateDepartment(dto: UpsertDepartmentDto): Promise<string> {
    const newId = await this.departmentRepository.AddDepartment(dto);
    if (!newId) {
      throw new Error("Failed to create department");
    }
    return newId;
  }

  async UpdateDepartment(dto: UpsertDepartmentDto): Promise<string> {
    const updatedId = await this.departmentRepository.UpdateDepartment(dto);
    if (!updatedId) {
      throw new Error("Failed to update department");
    }
    return updatedId;
  }

  async DeleteDepartment(id: string): Promise<string> {
    const deletedId = await this.departmentRepository.DeleteDepartment(id);
    if (!deletedId) {
      throw new Error("Failed to delete department");
    }
    return deletedId;
  }
}

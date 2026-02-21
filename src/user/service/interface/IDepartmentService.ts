import { UpsertDepartmentDto } from "../../dto/UpsertDepartment";
import { DepartmentModel } from "../../model/DepartmentModel";

export abstract class IDepartmentService {
    abstract GetDepartments(query?: Record<string, string>): Promise<[DepartmentModel[], number]>;
    abstract GetDepartmentById(id: string): Promise<DepartmentModel | null>;
    abstract CreateDepartment(dto: UpsertDepartmentDto): Promise<string>;
    abstract UpdateDepartment(dto: UpsertDepartmentDto): Promise<string>;
    abstract DeleteDepartment(id: string): Promise<string>;
}

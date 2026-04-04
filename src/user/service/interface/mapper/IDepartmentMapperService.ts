import { Department } from "../../../entity/Department";
import { DepartmentModel } from "../../../model/DepartmentModel";

export abstract class IDepartmentMapperService {
    abstract MapEntityToModel(entity: Department): DepartmentModel;
}

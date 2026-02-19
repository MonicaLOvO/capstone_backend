import { injectable } from "tsyringe";
import { Department } from "../../../entity/Department";
import { DepartmentModel } from "../../../model/DepartmentModel";
import { IDepartmentMapperService } from "../../interface/mapper/IDepartmentMapperService";

export { IDepartmentMapperService };

@injectable()
export class DepartmentMapperService extends IDepartmentMapperService {

    MapEntityToModel(entity: Department): DepartmentModel {
        const model = Object.assign<DepartmentModel, Partial<DepartmentModel>>(new DepartmentModel(), {
            DepartmentId: entity.DepartmentId,
            DepartmentName: entity.DepartmentName,
            Description: entity.Description ?? "",
            IsActive: entity.IsActive,
        });
        return model;
    }
}

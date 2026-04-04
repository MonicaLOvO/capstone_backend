import { Role } from "../../../entity/Role";
import { RoleModel } from "../../../model/RoleModel";

export abstract class IRoleMapperService {
    abstract MapEntityToModel(entity: Role): RoleModel;
}

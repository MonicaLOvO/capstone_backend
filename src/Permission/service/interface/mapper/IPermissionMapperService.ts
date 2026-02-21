import { Permission } from "../../../entity/Permission";
import { PermissionModel } from "../../../model/PermissionModel";

export abstract class IPermissionMapperService {
    abstract MapEntityToModel(entity: Permission): PermissionModel;
}

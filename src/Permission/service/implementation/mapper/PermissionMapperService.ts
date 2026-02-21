import { injectable } from "tsyringe";
import { Permission } from "../../../entity/Permission";
import { PermissionModel } from "../../../model/PermissionModel";
import { IPermissionMapperService } from "../../interface/mapper/IPermissionMapperService";

export { IPermissionMapperService };

@injectable()
export class PermissionMapperService extends IPermissionMapperService {

    MapEntityToModel(entity: Permission): PermissionModel {
        const model = Object.assign<PermissionModel, Partial<PermissionModel>>(new PermissionModel(), {
            Id: entity.Id,
            PermissionAction: entity.PermissionAction,
            Module: entity.Module,
            Description: entity.Description??"",
        });
        return model;
    }
}

import { User } from "../../../entity/User";
import { UserModel } from "../../../model/UserModel";

export abstract class IUserMapperService {
    abstract MapEntityToModel(entity: User): UserModel;
}

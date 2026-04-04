import { MediaAsset } from "../../../entity/MediaAsset";
import { MediaModel } from "../../../model/MediaModel";

export abstract class IMediaMapperService {
  abstract MapEntityToModel(entity: MediaAsset): MediaModel;
  abstract MapEntitiesToModel(entities?: MediaAsset[]): MediaModel[];
}

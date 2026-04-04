import { injectable } from "tsyringe";
import { MediaAsset } from "../../../entity/MediaAsset";
import { MediaModel } from "../../../model/MediaModel";
import { IMediaMapperService } from "../../interface/mapper/IMediaMapperService";

export { IMediaMapperService };

@injectable()
export class MediaMapperService extends IMediaMapperService {
  MapEntityToModel(entity: MediaAsset): MediaModel {
    if(!entity)
    {
      return new MediaModel();
    }

    return Object.assign<MediaModel, Partial<MediaModel>>(new MediaModel(), {
      Id: entity.Id,
      PublicId: entity.PublicId ?? "",
      SecureUrl: entity.SecureUrl,
      Version: entity.Version ?? 0,
      MimeType: entity.MimeType ?? "",
      Bytes: entity.Bytes ?? 0,
      Width: entity.Width ?? 0,
      Height: entity.Height ?? 0,
      CreatedAt: entity.CreatedAt ?? new Date(),
      UpdatedAt: entity.UpdatedAt ?? new Date(),
    });
  }

  MapEntitiesToModel(entities?: MediaAsset[]): MediaModel[] {
    return (entities ?? [])
      .map((asset) => this.MapEntityToModel(asset));
  }
}

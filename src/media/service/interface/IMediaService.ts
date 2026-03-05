import { MediaResourceTypeEnum } from "../../enum/MediaResourceTypeEnum";
import { MediaAsset } from "../../entity/MediaAsset";
import { MediaModel } from "../../model/MediaModel";

export interface MediaUploadFile {
  buffer: Buffer;
  mimetype: string;
}

export abstract class IMediaService {
  abstract GetByOwner(ownerType: MediaResourceTypeEnum, ownerId: string): Promise<MediaModel[]>;
  abstract UploadAndAttach(
    ownerType: MediaResourceTypeEnum,
    ownerId: string,
    file: MediaUploadFile,
  ): Promise<MediaModel>;
  abstract DeleteByOwner(ownerType: MediaResourceTypeEnum, ownerId: string, mediaId: string): Promise<void>;
}

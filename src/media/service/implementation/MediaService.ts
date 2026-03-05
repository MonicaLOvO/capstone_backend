import { inject, injectable } from "tsyringe";
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../../../common/config/cloudinary";
import { IMediaService, type MediaUploadFile } from "../interface/IMediaService";
import { MediaResourceTypeEnum } from "../../enum/MediaResourceTypeEnum";
import { MediaAsset } from "../../entity/MediaAsset";
import { MediaAssetRepository } from "../../repository/MediaAssetRepository";
import { UserRepository } from "../../../user/repository/UserRepository";
import { InventoryItemRepository } from "../../../inventory/repository/inventoryItemRepository";
import { RequestContext } from "../../../common/context/RequestContext";
import { MediaModel } from "../../model/MediaModel";
import { MediaMapperService } from "./mapper/MediaMapperService";

export { IMediaService };

@injectable()
export class MediaService extends IMediaService {
  constructor(
    @inject(MediaAssetRepository) private readonly mediaRepository: MediaAssetRepository,
    @inject(UserRepository) private readonly userRepository: UserRepository,
    @inject(InventoryItemRepository) private readonly inventoryRepository: InventoryItemRepository,
    @inject(MediaMapperService) private readonly mediaMapperService: MediaMapperService,
  ) {
    super();
  }

  async GetByOwner(ownerType: MediaResourceTypeEnum, ownerId: string): Promise<MediaModel[]> {
    const list = await this.mediaRepository.GetByOwner(ownerType, ownerId);
    return this.mediaMapperService.MapEntitiesToModel(list);
  }

  async UploadAndAttach(
    ownerType: MediaResourceTypeEnum,
    ownerId: string,
    file: MediaUploadFile,
  ): Promise<MediaModel> {
    if (!file) {
      throw new Error("Image file is required");
    }

    await this.ensureOwnerExists(ownerType, ownerId);

    const uploaded = await this.uploadToCloudinary(file.buffer, ownerType, ownerId);

    const context = RequestContext.current();
    const userId = context?.userId ?? "";
    const mediaAsset = new MediaAsset();

    if (ownerType === MediaResourceTypeEnum.USER) {
      mediaAsset.UserId = ownerId;
      mediaAsset.InventoryItemId = null;
    } else {
      mediaAsset.InventoryItemId = ownerId;
      mediaAsset.UserId = null;
    }
    mediaAsset.PublicId = uploaded.public_id;
    mediaAsset.SecureUrl = uploaded.secure_url;
    mediaAsset.Version = uploaded.version;
    mediaAsset.MimeType = file.mimetype;
    mediaAsset.Bytes = uploaded.bytes;
    mediaAsset.Width = uploaded.width;
    mediaAsset.Height = uploaded.height;
    mediaAsset.CreatedBy = userId;
    mediaAsset.UpdatedBy = userId;

    const saved = await this.mediaRepository.Save(mediaAsset);
    return this.mediaMapperService.MapEntityToModel(saved);
  }

  async DeleteByOwner(ownerType: MediaResourceTypeEnum, ownerId: string, mediaId: string): Promise<void> {
    const existing = await this.mediaRepository.GetByOwner(ownerType, ownerId);
    if (!existing || existing.length === 0) {
      return;
    }

    const media = existing.find((m) => m.Id === mediaId);
    if (!media) {
      throw new Error("Media not found");
    }

    if (media.PublicId) {
      await this.tryDestroyInCloudinary(media.PublicId);
    }

    const context = RequestContext.current();
    media.DeletedAt = new Date();
    media.UpdatedBy = context?.userId ?? "";
    await this.mediaRepository.Save(media);
  }

  private async ensureOwnerExists(ownerType: MediaResourceTypeEnum, ownerId: string): Promise<void> {
    switch (ownerType) {
      case MediaResourceTypeEnum.USER: {
        const user = await this.userRepository.GetUserById(ownerId);
        if (!user) {
          throw new Error("User not found");
        }
        return;
      }
      case MediaResourceTypeEnum.INVENTORY_ITEM: {
        const item = await this.inventoryRepository.GetInventoryItemById(ownerId);
        if (!item) {
          throw new Error("Inventory item not found");
        }
        return;
      }
      default:
        throw new Error("Unsupported media owner type");
    }
  }

  private uploadToCloudinary(fileBuffer: Buffer, ownerType: MediaResourceTypeEnum, ownerId: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `capstone/${ownerType.toLowerCase()}`,
          use_filename: false,
          unique_filename: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload failed"));
            return;
          }
          resolve(result);
        },
      );

      uploadStream.end(fileBuffer);
    });
  }

  private async tryDestroyInCloudinary(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    } catch {
      // Do not fail API on cleanup path.
    }
  }
}

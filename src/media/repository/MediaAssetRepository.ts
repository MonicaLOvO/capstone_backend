import { injectable } from "tsyringe";
import { IsNull, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { MediaAsset } from "../entity/MediaAsset";
import { MediaResourceTypeEnum } from "../enum/MediaResourceTypeEnum";

@injectable()
export class MediaAssetRepository {
  private readonly repository: Repository<MediaAsset>;

  constructor() {
    this.repository = AppDataSource.getRepository(MediaAsset);
  }

  async GetByOwner(ownerType: MediaResourceTypeEnum, ownerId: string): Promise<MediaAsset[]> {
    if (ownerType === MediaResourceTypeEnum.USER) {
      return this.repository.find({
        where: {
          UserId: ownerId,
          DeletedAt: IsNull(),
        },
        order: {
          CreatedAt: "DESC",
        },
      });
    }

    return this.repository.find({
      where: {
        InventoryItemId: ownerId,
        DeletedAt: IsNull(),
      },
      order: {
        CreatedAt: "DESC",
      },
    });
  }

  async Save(asset: MediaAsset): Promise<MediaAsset> {
    return this.repository.save(asset);
  }
}

import { BadRequestError, Delete, Get, JsonController, Param, Post, Req, UseBefore } from "routing-controllers";
import { inject, injectable } from "tsyringe";
import { DataRespondModel } from "../../common/model/DataRespondModel";
import { uploadSingleImage } from "../../common/middleware/upload";
import { AndPermission } from "../../common/decorator/PermissionDecorator";
import { PermissionModuleEnum } from "../../Permission/enum/PermissionModuleEnum";
import { PermissionActionEnum } from "../../Permission/enum/PermissionActionEnum";
import { IMediaService } from "../service/interface/IMediaService";
import { MediaResourceTypeEnum } from "../enum/MediaResourceTypeEnum";
import { MediaModel } from "../model/MediaModel";

interface MediaAssetResult {
  MediaAssetId: string;
  SecureUrl: string;
}

@JsonController("/api/media/inventory")
@injectable()
export class InventoryMediaController {
  constructor(@inject(IMediaService.name) private readonly mediaService: IMediaService) {}

  @Get("/:inventoryItemId")
  @AndPermission(PermissionModuleEnum.INVENTORY, PermissionActionEnum.VIEW)
  async getInventoryMedia(@Param("inventoryItemId") inventoryItemId: string) {
    const media = await this.mediaService.GetByOwner(MediaResourceTypeEnum.INVENTORY_ITEM, inventoryItemId);
    return new DataRespondModel<MediaModel[]>(media);
  }

  @Post("/:inventoryItemId")
  @AndPermission(PermissionModuleEnum.INVENTORY, PermissionActionEnum.UPDATE)
  @UseBefore(uploadSingleImage)
  async uploadInventoryMedia(@Param("inventoryItemId") inventoryItemId: string, @Req() req: any) {
    if (!req.file) {
      throw new BadRequestError("Image file is required");
    }

    const media = await this.mediaService.UploadAndAttach(MediaResourceTypeEnum.INVENTORY_ITEM, inventoryItemId, req.file);
    return new DataRespondModel<MediaModel>(media, "Inventory image uploaded successfully");
  }

  @Delete("/:inventoryItemId/:mediaId")
  @AndPermission(PermissionModuleEnum.INVENTORY, PermissionActionEnum.UPDATE)
  async deleteInventoryMedia(@Param("inventoryItemId") inventoryItemId: string, @Param("mediaId") mediaId: string) {
    await this.mediaService.DeleteByOwner(MediaResourceTypeEnum.INVENTORY_ITEM, inventoryItemId, mediaId);
    return new DataRespondModel<string>("ok", "Inventory image deleted successfully");
  }
}

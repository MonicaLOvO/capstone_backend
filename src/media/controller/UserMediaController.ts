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

@JsonController("/api/media/user")
@injectable()
export class UserMediaController {
  constructor(@inject(IMediaService.name) private readonly mediaService: IMediaService) {}

  @Get("/:userId")
  @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.VIEW)
  async getUserMedia(@Param("userId") userId: string) {
    const media = await this.mediaService.GetByOwner(MediaResourceTypeEnum.USER, userId);
    return new DataRespondModel<MediaModel[]>(media);
  }

  @Post("/:userId")
  @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.UPDATE)
  @UseBefore(uploadSingleImage)
  async uploadUserMedia(@Param("userId") userId: string, @Req() req: any) {
    if (!req.file) {
      throw new BadRequestError("Image file is required");
    }

    const media = await this.mediaService.UploadAndAttach(MediaResourceTypeEnum.USER, userId, req.file);
    return new DataRespondModel<MediaModel>(media, "User image uploaded successfully");
  }

  @Delete("/:userId/:mediaId")
  @AndPermission(PermissionModuleEnum.USER, PermissionActionEnum.UPDATE)
  async deleteUserMedia(@Param("userId") userId: string, @Param("mediaId") mediaId: string) {
    await this.mediaService.DeleteByOwner(MediaResourceTypeEnum.USER, userId, mediaId);
    return new DataRespondModel<string>("ok", "User image deleted successfully");
  }
}

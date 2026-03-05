import { Column, Entity, Index, JoinColumn, ManyToOne, Relation } from "typeorm";
import { Tracking } from "../../common/entity/Tracking";
import { User } from "../../user/entity/User";
import { InventoryItem } from "../../inventory/entity/Inventory-item";

@Entity("media_assets")
@Index("idx_media_user", ["UserId"])
@Index("idx_media_inventory_item", ["InventoryItemId"])
export class MediaAsset extends Tracking {
  @Column({ type: "varchar", length: 255, nullable: true })
  PublicId?: string;

  @Column({ type: "varchar", length: 500 })
  SecureUrl!: string;

  @Column({ type: "int", nullable: true })
  Version?: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  MimeType?: string;

  @Column({ type: "int", nullable: true })
  Bytes?: number;

  @Column({ type: "int", nullable: true })
  Width?: number;

  @Column({ type: "int", nullable: true })
  Height?: number;

  @Column({ type: "varchar", length: 36, nullable: true })
  UserId?: string | null;

  @ManyToOne(() => User, (user) => user.MediaAssets, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "UserId" })
  User?: Relation<User>;

  @Column({ type: "varchar", length: 36, nullable: true })
  InventoryItemId?: string | null;

  @ManyToOne(() => InventoryItem, (inventoryItem) => inventoryItem.MediaAssets, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "InventoryItemId" })
  InventoryItem?: Relation<InventoryItem>;
}

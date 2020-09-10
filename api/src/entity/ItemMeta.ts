import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Item } from "./Item";
import { Highlight } from "./Highlight";
import { ItemMetaHighlight } from "./ItemMetaHighlight";

@ObjectType()
@Entity()
export class ItemMeta {
  @Field()
  @PrimaryColumn()
  itemId: number;

  @Field()
  @Column("text", { nullable: false, default: "" })
  description: string;

  @Field()
  @Column("text", { nullable: false, default: "" })
  note: string;

  @Field((type) => Item)
  @OneToOne((type) => Item, (item) => item.item_meta, { onDelete: "CASCADE" })
  @JoinColumn({ name: "itemId" })
  item: Item;

  @Field((type) => [ItemMetaHighlight])
  @OneToMany(
    (type) => ItemMetaHighlight,
    (item_meta_highlight) => item_meta_highlight.itemMeta
  )
  highlightConnector: ItemMetaHighlight[];

  @Field()
  @UpdateDateColumn()
  updated_at: string;

  @Field()
  @CreateDateColumn()
  created_at: string;
}

import {
  Entity,
  PrimaryColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { ItemMeta } from "./ItemMeta";
import { Highlight } from "./Highlight";

@ObjectType()
@Entity()
export class ItemMetaHighlight {
  @Field()
  @PrimaryColumn()
  itemMetaId: number;

  @Field()
  @PrimaryColumn()
  highlightId: number;

  @Field((type) => ItemMeta)
  @ManyToOne((type) => ItemMeta, (item_meta) => item_meta.highlightConnector, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "itemMetaId" })
  itemMeta: ItemMeta;

  @Field((type) => Highlight)
  @OneToOne((type) => Highlight, (highlight) => highlight.itemMetaConnector, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "highlightId" })
  highlight: Highlight;

  @Field()
  @UpdateDateColumn()
  updated_at: string;

  @Field()
  @CreateDateColumn()
  created_at: string;
}

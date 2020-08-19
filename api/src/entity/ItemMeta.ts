import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Field, ID, ObjectType, ArgsType } from "type-graphql";
import { Item } from "./Item";
import { Base } from "./Base";

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

  @Field()
  @UpdateDateColumn()
  updated_at: string;

  @Field()
  @CreateDateColumn()
  created_at: string;
}

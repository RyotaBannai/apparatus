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

@ObjectType()
@Entity()
export class ItemMeta {
  @PrimaryColumn()
  itemId: number;

  @Field((type) => Item)
  @OneToOne((type) => Item, (item) => item.item_meta, { primary: true })
  @JoinColumn({ name: "itemId" })
  item: Item;

  @Field()
  @Column("text")
  description: string;

  @Field()
  @Column("text")
  note: string;

  @UpdateDateColumn()
  updated_at: string;

  @CreateDateColumn()
  created_at: string;
}

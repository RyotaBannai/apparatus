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
export class ItemMeta extends Base {
  @Field()
  @Column("text", { nullable: true })
  description: string;

  @Field()
  @Column("text", { nullable: true })
  note: string;

  @Field((type) => Item)
  @OneToOne((type) => Item, (item) => item.item_meta)
  item: Item;
}

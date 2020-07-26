import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Ctx, Field, ID, ObjectType, ArgsType } from "type-graphql";
import { Base } from "./Base";
import { Item } from "./Item";
import { Set } from "./Set";

@ObjectType()
@Entity()
export class ItemSet {
  @Field()
  @PrimaryColumn()
  itemId: number;

  @Field()
  @PrimaryColumn()
  setId: number;

  @Field((type) => Item)
  @ManyToOne((type) => Item, (item) => item.setConnector)
  @JoinColumn({ name: "itemId" })
  item: Item;

  @Field((type) => Set)
  @ManyToOne((type) => Set, (set) => set.itemConnector)
  @JoinColumn({ name: "setId" })
  set: Set;

  @Field()
  @UpdateDateColumn()
  updated_at: string;

  @Field()
  @CreateDateColumn()
  created_at: string;
}

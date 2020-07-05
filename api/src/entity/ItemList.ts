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
import { List } from "./List";

@ObjectType()
@Entity()
export class ItemList {
  @Field()
  @PrimaryColumn()
  itemId: number;

  @Field()
  @PrimaryColumn()
  listId: number;

  @Field((type) => Item)
  @ManyToOne((type) => Item, (item) => item.listConnector)
  @JoinColumn({ name: "itemId" })
  item: Item;

  @Field((type) => List)
  @ManyToOne((type) => List, (list) => list.itemConnector)
  @JoinColumn({ name: "listId" })
  list: List;

  @Field()
  @UpdateDateColumn()
  updated_at: string;

  @Field()
  @CreateDateColumn()
  created_at: string;
}

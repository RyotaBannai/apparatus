import {
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { UserMeta } from "./UserMeta";
import { ItemMeta } from "./ItemMeta";
import { ItemList } from "./ItemList";
import { ItemSet } from "./ItemSet";
import { List } from "./List";
import { ItemWorkspace } from "./ItemWorkspace";
export type ItemType = "line" | "field" | "quiz";

@ObjectType()
@Entity()
export class Item extends Base {
  @Field()
  @Column("text")
  data: string;

  @Field()
  @Column()
  type: ItemType; // should use graphql enum type

  @Field((type) => ItemMeta)
  @OneToOne((type) => ItemMeta, (item_meta) => item_meta.item)
  item_meta: ItemMeta;

  @Field((type) => [ItemList])
  @OneToMany((type) => ItemList, (item_list) => item_list.item)
  @JoinColumn()
  listConnector: ItemList[];

  @Field((type) => [ItemSet])
  @OneToMany((type) => ItemSet, (item_set) => item_set.item)
  @JoinColumn()
  setConnector: ItemSet[];

  @Field((type) => [ItemWorkspace])
  @OneToMany((type) => ItemWorkspace, (item_ws) => item_ws.item)
  @JoinColumn()
  wsConnector: ItemWorkspace[];

  @ManyToOne((type) => UserMeta, (user_meta) => user_meta.item)
  user_meta: UserMeta;

  @Field((type) => [List])
  list: List[];

  // helpers - index calculations
  // get startIndex(): number {
  //   return this.skip;
  // }
  // get endIndex(): number {
  //   return this.skip + this.take;
  // }
}

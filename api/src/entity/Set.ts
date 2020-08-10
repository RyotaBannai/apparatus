import { Entity, Column, OneToMany, JoinColumn, ManyToMany } from "typeorm";
import { Ctx, Field, ID, ObjectType, ArgsType } from "type-graphql";
import { Base } from "./Base";
import { Item } from "./Item";
import { ItemData } from "../modules/item/TypeDefs";
import { ItemSet } from "./ItemSet";
import { SetWorkspace } from "./SetWorkspace";

@ObjectType()
@Entity()
export class Set extends Base {
  @Field()
  @Column()
  name: string;

  @Field((type) => ID)
  @Column()
  ownerId: number;

  @Field((type) => [ItemData])
  items: ItemData[];

  @OneToMany((type) => ItemSet, (item_set) => item_set.set)
  itemConnector: ItemSet[];

  @OneToMany((type) => SetWorkspace, (set_ws) => set_ws.set)
  @JoinColumn()
  wsConnector: SetWorkspace[];
}

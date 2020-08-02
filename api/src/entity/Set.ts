import { Entity, Column, OneToMany, JoinColumn, ManyToMany } from "typeorm";
import { Ctx, Field, ID, ObjectType, ArgsType } from "type-graphql";
import { Base } from "./Base";
import { Item } from "./Item";
import { ItemSet } from "./ItemSet";

@ObjectType()
@Entity()
export class Set extends Base {
  @Field()
  @Column()
  name: string;

  @Field((type) => ID)
  @Column()
  ownerId: number;

  @Field((type) => [Item])
  items: Item[];

  @OneToMany((type) => ItemSet, (item_set) => item_set.set)
  itemConnector: ItemSet[];
}

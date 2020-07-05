import { Entity, Column, OneToMany, JoinColumn, ManyToMany } from "typeorm";
import { Ctx, Field, ID, ObjectType, ArgsType } from "type-graphql";
import { Base } from "./Base";
import { ItemList } from "./ItemList";

@ObjectType()
@Entity()
export class List extends Base {
  @Field()
  @Column()
  name: string;

  @Field((type) => [ItemList])
  @OneToMany((type) => ItemList, (item_list) => item_list.list)
  itemConnector: ItemList[];

  // @Column({ nullable: true })
  // setConnector: ItemSet[]];
}

import { Entity, Column, OneToMany, JoinColumn, ManyToMany } from "typeorm";
import { Field, ObjectType, ArgsType } from "type-graphql";
import { Base } from "./Base";
import { Item } from "./Item";
import { ItemWorkspace } from "./ItemWorkspace";

@ObjectType()
@Entity()
export class Workspace extends Base {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  ownerId: string;

  @Field((type) => [ItemWorkspace])
  @OneToMany((type) => ItemWorkspace, (item_ws) => item_ws.ws)
  @JoinColumn()
  itemConnector: ItemWorkspace[];
}

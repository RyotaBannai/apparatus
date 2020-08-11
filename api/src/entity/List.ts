import { Entity, Column, OneToMany, JoinColumn, ManyToMany } from "typeorm";
import { Ctx, Field, ID, ObjectType, ArgsType } from "type-graphql";
import { Base } from "./Base";
import { AddeeList } from "./AddeeList";
import { ListWorkspace } from "./ListWorkspace";

@ObjectType()
@Entity()
export class List extends Base {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field((type) => ID)
  @Column()
  ownerId: number;

  @Field((type) => [AddeeList])
  @OneToMany((type) => AddeeList, (addee_list) => addee_list.list)
  addeeConnector: AddeeList[];

  @OneToMany((type) => ListWorkspace, (list_ws) => list_ws.list)
  @JoinColumn()
  wsConnector: ListWorkspace[];
}

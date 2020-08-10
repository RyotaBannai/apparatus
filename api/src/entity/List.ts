import { Entity, Column, OneToMany, JoinColumn, ManyToMany } from "typeorm";
import { Ctx, Field, ID, ObjectType, ArgsType } from "type-graphql";
import { Base } from "./Base";
import { AddeeList } from "./AddeeList";

@ObjectType()
@Entity()
export class List extends Base {
  @Field()
  @Column()
  name: string;

  @Field((type) => [AddeeList])
  @OneToMany((type) => AddeeList, (addee_list) => addee_list.list)
  addeeConnector: AddeeList[];

  // @Column({ nullable: true })
  // setConnector: ItemSet[]];
}

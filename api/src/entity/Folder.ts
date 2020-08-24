import {
  Entity,
  Column,
  OneToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Base } from "./Base";

/*
{
	"name":"astronomy",
	"description":"relative to science", 
	"parent_id": 2
}
*/

@ObjectType()
@Entity()
@Tree("closure-table")
export class Folder extends Base {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column("text")
  description: string;

  @Field((type) => [Folder])
  @TreeChildren()
  children: Folder[];

  @Field((type) => Folder)
  @TreeParent()
  parent: Folder;

  @Field((type) => ID)
  @Column()
  ownerId: number;
}

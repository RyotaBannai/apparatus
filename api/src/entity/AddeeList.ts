import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { Ctx, Field, ID, ObjectType, ArgsType } from "type-graphql";
import { Addee } from "./Addee";
import { List } from "./List";

@ObjectType()
@Entity()
export class AddeeList {
  @Field()
  @PrimaryColumn()
  addeeId: number;

  @Field()
  @PrimaryColumn()
  listId: number;

  @Field((type) => Addee)
  @ManyToOne((type) => Addee, (addee) => addee.listConnector, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "addeeId" })
  addee: Addee;

  @Field((type) => List)
  @ManyToOne((type) => List, (list) => list.addeeConnector, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "listId" })
  list: List;

  @Field()
  @UpdateDateColumn()
  updated_at: string;

  @Field()
  @CreateDateColumn()
  created_at: string;
}

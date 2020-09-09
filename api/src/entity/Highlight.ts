import {
  Entity,
  Column,
  OneToMany,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { Ctx, Field, ID, ObjectType, ArgsType } from "type-graphql";
import { Base } from "./Base";
import { Item } from "./Item";

@ObjectType()
@Entity()
export class Highlight extends Base {
  @PrimaryColumn()
  @Field((type) => ID)
  targetId: number;

  @PrimaryColumn()
  @Field()
  targetType: string;

  @Column()
  @Field((type) => Number)
  start: number;

  @Column()
  @Field((type) => Number)
  end: number;
}

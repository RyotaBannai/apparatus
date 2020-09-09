import { Entity, Column, OneToMany, JoinColumn, OneToOne } from "typeorm";
import { Ctx, Field, ID, ObjectType, ArgsType } from "type-graphql";
import { Base } from "./Base";
import { Item } from "./Item";

@ObjectType()
@Entity()
export class Highlight extends Base {
  @Column()
  @Field((type) => ID)
  targetId: number;

  @Column()
  @Field()
  targetType: string;

  @Column()
  @Field((type) => Number)
  start: number;

  @Column()
  @Field((type) => Number)
  end: number;
}

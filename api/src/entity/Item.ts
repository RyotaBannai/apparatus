import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import {
  Ctx,
  Field,
  ID,
  Int,
  ObjectType,
  ArgsType,
  InputType,
  Float,
} from "type-graphql";
import { Min, Max } from "class-validator";
import { Base } from "./Base";
import { UserMeta } from "./UserMeta";
import { ItemList } from "./ItemList";
import { ItemSet } from "./ItemSet";
import { List } from "./List";
type ItemType = "line" | "field" | "quiz";

@ObjectType()
@Entity()
export class Item extends Base {
  @Field()
  @Column("text")
  data: string;

  @Field()
  @Column()
  type: ItemType; // should use graphql enum type

  @Field((type) => [ItemList])
  @OneToMany((type) => ItemList, (item_list) => item_list.item)
  @JoinColumn()
  listConnector: ItemList[];

  @Field((type) => [ItemSet])
  @OneToMany((type) => ItemSet, (item_set) => item_set.item)
  @JoinColumn()
  setConnector: ItemSet[];

  @ManyToOne((type) => UserMeta, (user_meta) => user_meta.item)
  user_meta: UserMeta;

  @Field((type) => [List])
  list: List[];

  // helpers - index calculations
  // get startIndex(): number {
  //   return this.skip;
  // }
  // get endIndex(): number {
  //   return this.skip + this.take;
  // }
}

@InputType({ description: "New item data" })
export class addItemInput implements Partial<Item> {
  @Field((type) => Float, { nullable: true })
  id?: number;

  @Field((type) => String, { nullable: true })
  data: string;

  @Field((type) => String, { nullable: true })
  type: ItemType;
}

@InputType({ description: "New items data" })
export class addItemInputs implements Partial<Item> {
  @Field((type) => String, { nullable: true })
  data: string;
}

@ArgsType()
export class GetItemArgs {
  @Field((type) => Int, { nullable: true })
  @Min(0)
  skip?: number;

  @Field((type) => Int, { nullable: true })
  @Min(1)
  take = 1;

  @Field((type) => Int, { nullable: true })
  current?: string;

  get startIndex(): number {
    if (typeof this.skip === "number" && typeof this.current === "number")
      return this.take * this.current + this.skip;
    else return 0;
  }

  get endIndex(): number {
    return this.startIndex + this.take;
  }
}

@ObjectType()
export class Response {
  @Field((type) => String)
  res: string;
}

import { Entity, Column, OneToMany, JoinColumn, ManyToMany } from "typeorm";
import { Ctx, Field, ID, ObjectType, createUnionType } from "type-graphql";
import { Base } from "./Base";
import { AddeeList } from "./AddeeList";
import { Item } from "./Item";
import { Set } from "./Set";

@ObjectType()
@Entity()
export class Addee extends Base {
  @Field()
  @Column()
  morphType: string;

  @Field((type) => ID)
  @Column()
  morphId: number;

  @Field((type) => AddeeUnion)
  target: Item | Set;

  @OneToMany((type) => AddeeList, (addee_list) => addee_list.addee)
  listConnector: AddeeList[];
}

export const AddeeUnion = createUnionType({
  name: "AddeeUnion",
  types: () => [Item, Set] as const,
  resolveType: (value) => {
    if ("data" in value) {
      return Item;
    }
    if ("name" in value) {
      return Set;
    }
    return undefined;
  },
});

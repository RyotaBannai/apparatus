import { ID, Field, ObjectType, ArgsType, InputType } from "type-graphql";

@ArgsType()
export class getAddessArgs {
  @Field((type) => Number)
  id: number;
}

@InputType({ description: "New Addees to List's[id]" })
export class addAddeesInputs {
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  addee_type: string;

  @Field((type) => Number)
  addee_ids: number[];
}

@InputType({
  description: "Delete Addees(item's[id], set's[id]) from List's[id]",
})
export class deleteAddeesInputs {
  @Field((type) => Number)
  listId: number;

  @Field((type) => Number)
  itemIds: number[];

  @Field((type) => Number)
  setIds: number[];
}

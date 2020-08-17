import { ID, Field, ObjectType, ArgsType, InputType } from "type-graphql";

@ArgsType()
export class getAddessArgs {
  @Field((type) => Number)
  id: number;
}

@InputType({ description: "New Addees to List's[id]" })
export class addAddeesInput {
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  addee_type: string;

  @Field((type) => Number)
  addee_ids: number[];
}

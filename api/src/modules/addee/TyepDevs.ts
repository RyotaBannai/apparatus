import { ID, Field, ObjectType, ArgsType, InputType } from "type-graphql";

@ArgsType()
export class getAddessArgs {
  @Field((type) => Number)
  id: number;
}

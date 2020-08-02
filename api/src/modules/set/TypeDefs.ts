import { ID, Field, ObjectType, ArgsType, InputType } from "type-graphql";

@ArgsType()
export class getSetbyIDArgs {
  @Field((type) => String)
  id: string;
}

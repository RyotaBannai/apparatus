import { ID, Field, ObjectType, ArgsType, InputType } from "type-graphql";

@ArgsType()
export class getSetbyIDArgs {
  @Field((type) => Number)
  id: number;

  @Field((type) => Number)
  wsId: number;
}

@ArgsType()
export class getSetArgs {
  @Field((type) => Number)
  wsId: number;
}

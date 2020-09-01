import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class GraphQLResponse {
  @Field((type) => String)
  res: string;
}

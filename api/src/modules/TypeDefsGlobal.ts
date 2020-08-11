import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Response {
  @Field((type) => String)
  res: string;
}

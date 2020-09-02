import { List } from "../../entity/List";
import { ID, Field, ObjectType, ArgsType, InputType } from "type-graphql";

@InputType({ description: "New List data" })
export class createListInput implements Partial<List> {
  @Field((type) => String, { nullable: false })
  name: string;

  @Field((type) => String, { nullable: false })
  description: string;

  @Field((type) => Number)
  wsId: number;
}

@InputType({ description: "Edit List" })
export class editListInputs extends createListInput {
  @Field((type) => String)
  id: string;
}

@InputType({ description: "Delete List" })
export class deleteListInputs {
  @Field((type) => String)
  id: string;
}

@ArgsType()
export class getListByIDArgs {
  @Field((type) => String)
  id: string;
}

@ArgsType()
export class getListsArgs {
  @Field((type) => Number)
  wsId: number;
}

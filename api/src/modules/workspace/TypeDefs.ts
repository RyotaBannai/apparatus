import { Workspace } from "../../entity/Workspace";
import { ID, Field, ObjectType, ArgsType, InputType } from "type-graphql";

@InputType({ description: "New WS data" })
export class createWSInput implements Partial<Workspace> {
  @Field((type) => String, { nullable: false })
  name: string;
  @Field((type) => String, { nullable: false })
  description: string;
}

@InputType({ description: "Edit WS" })
export class editWSInput extends createWSInput {
  @Field((type) => String)
  id: string;
}

@ArgsType()
export class getWSByIDArgs {
  @Field((type) => String)
  id: string;
}

@ArgsType()
export class getWSArgs implements Partial<Workspace> {
  @Field((type) => ID, { nullable: false })
  ownerId: number;
}

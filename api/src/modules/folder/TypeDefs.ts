import { Field, InputType, ArgsType } from "type-graphql";

@InputType({ description: "Create New Folder" })
export class createFolderInputs {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  description: string;

  @Field((type) => Number)
  parentId: number;

  @Field((type) => Number)
  wsId: number;
}

@ArgsType()
export class getFolderInputs {
  @Field((type) => String)
  id: string;
}

@ArgsType()
export class getFoldersInputs {
  @Field((type) => String)
  wsId: string;
}
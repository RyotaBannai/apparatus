import { Field, InputType, ArgsType } from "type-graphql";

@InputType({ description: "Create New Folder" })
export class createFolderInputs {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  description: string;

  @Field((type) => Number, { nullable: true })
  parentId: number;

  @Field((type) => Number)
  wsId: number;
}

@InputType({ description: "Add List to Folder" })
export class addListsInputs {
  @Field((type) => Number)
  folderId: number;

  @Field((type) => [Number])
  lists: number[];
}

@ArgsType()
export class getFolderInputs {
  @Field((type) => String)
  id: string;

  @Field((type) => Number)
  wsId: number;
}

@ArgsType()
export class getFoldersInputs {
  @Field((type) => String)
  wsId: string;
}

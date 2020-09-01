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

@InputType({ description: "Update Folder" })
export class updateFolderInputs {
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  description: string;
}

@InputType({ description: "Delete Folder" })
export class deleteFolderInputs {
  @Field((type) => Number)
  id: number;
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

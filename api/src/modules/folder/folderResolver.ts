import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Resolver,
  Root,
  Query,
} from "type-graphql";
import { getRepository, getTreeRepository } from "typeorm";
import { Context } from "vm";
import { List } from "../../entity/List";
import { Folder } from "../../entity/Folder";
import { FolderWorkspace } from "../../entity/FolderWorkspace";
import { Workspace } from "../../entity/Workspace";
import {
  getFolderInputs,
  getFoldersInputs,
  createFolderInputs,
} from "./TypeDefs";

@Resolver((of) => Folder)
export class FolderResolver {
  @Mutation(() => Folder)
  async createFolder(
    @Arg("data") inputs: createFolderInputs,
    @Ctx() ctx: Context
  ): Promise<Folder> {
    let parent: Folder = await Folder.findOneOrFail(inputs.parentId);
    let new_folder: Folder = await Folder.create({
      name: inputs.name,
      description: inputs.description,
      ownerId: ctx.user.id,
      parent: parent,
    }).save();

    let this_workspace: Workspace = await Workspace.findOneOrFail(inputs.wsId);
    let new_folder_ws: FolderWorkspace = new FolderWorkspace();
    new_folder_ws.folder = new_folder;
    new_folder_ws.ws = this_workspace;
    await getRepository(FolderWorkspace).save(new_folder_ws);

    return new_folder;
  }

  @Query((returns) => Folder)
  async getFolder(
    @Args() { id }: getFolderInputs,
    @Ctx() ctx: Context
  ): Promise<Folder> {
    return await Folder.findOneOrFail({
      where: {
        id: Number(id),
        ownerId: ctx.user.id,
      },
      relations: ["wsConnector", "wsConnector.ws"],
    });
  }

  @Query((returns) => [Folder])
  async getFolders(
    @Args() { wsId }: getFoldersInputs,
    @Ctx() ctx: Context
  ): Promise<Folder[]> {
    const this_folders: Folder[] = await Folder.find({
      where: {
        ownerId: ctx.user.id,
      },
      relations: ["wsConnector", "wsConnector.ws"],
    });

    return this_folders.filter((folder) => {
      return folder.wsConnector?.wsId === Number(wsId);
    });
  }

  @FieldResolver()
  async children_folder(@Root() folder: Folder) {
    const this_folder: Folder = await Folder.findOneOrFail(folder.id);
    const children = await getTreeRepository(Folder).findDescendantsTree(
      this_folder
    );
    return JSON.stringify(children);
  }

  @FieldResolver()
  async parent_folder(@Root() folder: Folder) {
    const this_folder: Folder = await Folder.findOneOrFail(folder.id);
    const parent = await getTreeRepository(Folder).findAncestorsTree(
      this_folder
    );
    return parent?.parent ? JSON.stringify(parent) : null;
  }

  @FieldResolver()
  async lists(@Root() folder: Folder) {
    const this_folder: Folder = await Folder.findOneOrFail(folder.id, {
      relations: ["listConnector", "listConnector.list"],
    });
    return this_folder.listConnector?.map((list_folder) => list_folder.list);
  }
}

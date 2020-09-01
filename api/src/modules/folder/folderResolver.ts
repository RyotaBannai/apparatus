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
import { Folder } from "../../entity/Folder";
import { FolderWorkspace } from "../../entity/FolderWorkspace";
import { List } from "../../entity/List";
import { ListFolder } from "../../entity/ListFolder";
import { Workspace } from "../../entity/Workspace";
import {
  addListsInputs,
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
    let new_folder_params = {
      name: inputs.name,
      description: inputs.description,
      ownerId: ctx.user.id,
    };
    if (inputs.parentId) {
      new_folder_params = Object.assign(new_folder_params, {
        parent: await Folder.findOneOrFail(inputs.parentId),
      });
    }
    let new_folder: Folder = await Folder.create(new_folder_params).save();

    let this_workspace: Workspace = await Workspace.findOneOrFail(inputs.wsId);
    let new_folder_ws: FolderWorkspace = new FolderWorkspace();
    new_folder_ws.folder = new_folder;
    new_folder_ws.ws = this_workspace;
    await getRepository(FolderWorkspace).save(new_folder_ws);

    return new_folder;
  }

  @Mutation(() => Folder)
  async addLists(
    @Arg("data") inputs: addListsInputs,
    @Ctx() ctx: Context
  ): Promise<Folder> {
    const folder: Folder = await Folder.findOneOrFail(inputs.folderId);
    await Promise.all(
      inputs.lists.map(async (listId: number) => {
        const this_list: List = await List.findOneOrFail(listId);
        let new_list_folder: ListFolder = new ListFolder();
        new_list_folder.list = this_list;
        new_list_folder.folder = folder;
        await getRepository(ListFolder).save(new_list_folder);
      })
    );
    return folder;
  }

  @Query((returns) => Folder)
  async getFolder(
    @Args() { id, wsId }: getFolderInputs,
    @Ctx() ctx: Context
  ): Promise<Folder> {
    let this_folder: Folder;
    if (id === "") {
      const roots = await getTreeRepository(Folder).findRoots();
      const this_root: Folder[] = await Promise.all(
        roots.map(
          async (root: Folder) =>
            await Folder.findOneOrFail(root.id, {
              relations: ["wsConnector"],
            })
        )
      );
      return this_root.filter(
        (root: Folder) => root.wsConnector.wsId === Number(wsId)
      )[0];
    } else {
      this_folder = await Folder.findOneOrFail({
        where: {
          id: Number(id),
          ownerId: ctx.user.id,
        },
        relations: ["wsConnector", "wsConnector.ws"],
      });
    }

    return this_folder!;
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
    return await Promise.all(
      children?.children.map(async (child: Folder) => {
        let this_child: Folder = await Folder.findOneOrFail(child.id);
        this_child.children = child.children;
        return this_child;
      })
    );
  }

  @FieldResolver()
  async parent_folder(@Root() folder: Folder) {
    const this_folder: Folder = await Folder.findOneOrFail(folder.id);
    const parent = await getTreeRepository(Folder).findAncestorsTree(
      this_folder
    );
    return JSON.stringify(parent);
  }

  @FieldResolver()
  async lists(@Root() folder: Folder) {
    const this_folder: Folder = await Folder.findOneOrFail(folder.id, {
      relations: ["listConnector", "listConnector.list"],
    });
    return this_folder.listConnector?.map((list_folder) => list_folder.list);
  }
}

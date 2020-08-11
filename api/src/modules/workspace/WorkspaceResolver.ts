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
import { getRepository } from "typeorm";
import { Context } from "vm";
import {
  createWSInput,
  editWSInput,
  getWSArgs,
  getWSByIDArgs,
} from "./TypeDefs";
import { Workspace } from "../../entity/Workspace";
import { Item } from "../../entity/Item";

@Resolver((of) => Workspace)
export class WorkspaceResolver {
  @Mutation(() => Workspace)
  async createWorkspace(
    @Arg("data") newWSData: createWSInput,
    @Ctx() ctx: Context
  ): Promise<Workspace> {
    const new_workspace = Workspace.create({
      name: newWSData.name,
      description: newWSData.description,
      ownerId: ctx.user.id,
    });
    return await new_workspace.save();
  }

  @Mutation(() => Workspace)
  async editWorkspace(
    @Arg("data") editWSData: editWSInput,
    @Ctx() ctx: Context
  ): Promise<Workspace> {
    const new_workspace = await Workspace.findOneOrFail({
      where: {
        id: editWSData.id,
        ownerId: ctx.user.id,
      },
    });
    new_workspace.name = editWSData.name;
    new_workspace.description = editWSData.description;
    return await new_workspace.save();
  }

  @Query((returns) => Workspace)
  async getWorkspace(
    @Args() { id }: getWSByIDArgs, // @Arg("id") id: number,
    @Ctx() ctx: Context
  ): Promise<Workspace> {
    return await Workspace.findOneOrFail({
      where: {
        id: id,
        ownerId: ctx.user.id,
      },
    });
  }

  @Query((returns) => [Workspace])
  async getWorkspaces(@Ctx() ctx: Context): Promise<Workspace[] | undefined> {
    return await Workspace.find({
      where: { ownerId: ctx.user.id },
    });
  }

  @FieldResolver()
  async items(@Root() workspace: Workspace) {
    const this_workspace: Workspace = await Workspace.findOneOrFail(
      workspace.id,
      {
        relations: ["itemConnector", "itemConnector.item"],
      }
    );
    const this_items: Item[] = [];
    for (const { item } of this_workspace.itemConnector) {
      this_items.push(item);
    }
    return this_items;
  }
}

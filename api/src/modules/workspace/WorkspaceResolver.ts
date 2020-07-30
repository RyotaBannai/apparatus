import { Arg, Args, Int, Mutation, Query, Resolver, Ctx } from "type-graphql";
import { getRepository } from "typeorm";
import { Context } from "vm";
import { Workspace, createWSInput, getWSArgs } from "../../entity/Workspace";

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

  @Query((returns) => [Workspace])
  async getWorkspaces(@Ctx() ctx: Context): Promise<Workspace[] | undefined> {
    return await Workspace.find({
      where: { ownerId: ctx.user.id },
    });
  }
}

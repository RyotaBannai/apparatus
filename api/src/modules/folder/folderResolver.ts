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
import { Folder } from "../../entity/Folder";

@Resolver((of) => Folder)
export class FolderResolver {
  @Mutation(() => Folder)
  async createFolder(@Ctx() ctx: Context): Promise<Folder> {
    let parent: Folder = await Folder.findOneOrFail(1);
    return await Folder.create({
      name: "test",
      description: "desc",
      ownerId: ctx.user.id,
      parent: parent,
    }).save();
  }

  @Query((returns) => Folder)
  async getFolders(@Ctx() ctx: Context): Promise<Folder> {
    return await Folder.findOneOrFail({
      where: {
        ownerId: ctx.user.id,
      },
    });
  }
}

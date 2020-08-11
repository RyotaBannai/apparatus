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
import { getRepository, UpdateResult } from "typeorm";
import { Context } from "vm";
import { createListInput, editListInput, getListByIDArgs } from "./TypeDefs";
import { Response } from "../TypeDefsGlobal";
import { Global } from "../../const/constants";
import { Item } from "../../entity/Item";
import { List } from "../../entity/List";

@Resolver((of) => List)
export class ListResolver {
  @Mutation(() => List)
  async createList(
    @Arg("data") newListData: createListInput,
    @Ctx() ctx: Context
  ): Promise<List> {
    return await List.create({
      name: newListData.name,
      description: newListData.description,
      ownerId: ctx.user.id,
    }).save();
  }

  @Mutation(() => List)
  async editList(@Arg("data") editListData: editListInput): Promise<Response> {
    const result: UpdateResult = await List.update(editListData.id, {
      name: editListData.name,
      description: editListData.description,
    });
    console.log(result);
    return { res: Global.SUCCESS };
  }

  @Query((returns) => List)
  async getList(
    @Args() { id }: getListByIDArgs,
    @Ctx() ctx: Context
  ): Promise<List> {
    return await List.findOneOrFail({
      where: {
        id: id,
        ownerId: ctx.user.id,
      },
    });
  }

  @Query((returns) => [List])
  async getLists(@Ctx() ctx: Context): Promise<List[] | undefined> {
    return await List.find({
      where: { ownerId: ctx.user.id },
    });
  }

  // @FieldResolver()
  // async items(@Root() list: List) {
  //   const this_workspace: Workspace = await Workspace.findOneOrFail(
  //     workspace.id,
  //     {
  //       relations: ["itemConnector", "itemConnector.item"],
  //     }
  //   );
  //   const this_items: Item[] = [];
  //   for (const { item } of this_workspace.itemConnector) {
  //     this_items.push(item);
  //   }
  //   return this_items;
  // }
}

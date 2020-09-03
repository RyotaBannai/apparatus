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
import {
  createListInput,
  editListInputs,
  deleteListInputs,
  getListByIDArgs,
  getListsArgs,
} from "./TypeDefs";
import { GraphQLResponse } from "../TypeDefsGlobal";
import { Global } from "../../const/constants";
import { Item } from "../../entity/Item";
import { Set } from "../../entity/Set";
import { List } from "../../entity/List";
import { AddeeList } from "../../entity/AddeeList";
import { ListWorkspace } from "../../entity/ListWorkspace";
import { Workspace } from "../../entity/Workspace";

@Resolver((of) => List)
export class ListResolver {
  @Mutation(() => List)
  async createList(
    @Arg("data") newListData: createListInput,
    @Ctx() ctx: Context
  ): Promise<List> {
    const new_list: List = await List.create({
      name: newListData.name,
      description: newListData.description,
      ownerId: ctx.user.id,
    }).save();

    const workspace: Workspace = await Workspace.findOneOrFail(
      newListData.wsId
    );
    let new_item_ws: ListWorkspace = new ListWorkspace();
    new_item_ws.list = new_list;
    new_item_ws.ws = workspace;
    await getRepository(ListWorkspace).save(new_item_ws);

    return new_list;
  }

  @Mutation(() => GraphQLResponse)
  async editList(
    @Arg("data") inputs: editListInputs
  ): Promise<GraphQLResponse> {
    const { id, name, description } = inputs;
    await List.update(id, {
      name,
      description,
    });
    return { res: Global.SUCCESS };
  }

  @Mutation(() => GraphQLResponse)
  async deleteList(
    @Arg("data") inputs: deleteListInputs
  ): Promise<GraphQLResponse> {
    await List.delete(inputs.id);
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
  async getLists(
    @Args() { wsId }: getListsArgs,
    @Ctx() ctx: Context
  ): Promise<List[] | undefined> {
    let this_lists: List[] = await List.find({
      where: { ownerId: ctx.user.id },
      relations: ["wsConnector", "wsConnector.ws"],
    });
    return this_lists.filter((list) => list.wsConnector?.ws.id === wsId);
  }

  @FieldResolver()
  async targets(@Root() list: List) {
    const this_list: List = await List.findOneOrFail(list.id, {
      relations: ["addeeConnector", "addeeConnector.addee"],
    });

    return this_list.addeeConnector.map(async (addee_list: AddeeList) => {
      let relations: string[] = [];
      if (addee_list.addee.morphType === "Item") {
        relations = ["item_meta"];
        const item: Item = (await getRepository(
          addee_list.addee.morphType
        ).findOneOrFail(addee_list.addee.morphId, {
          relations: relations,
        })) as Item;
        return {
          id: item.id,
          type: item.type,
          data: item.data,
          description: item.item_meta.description,
          note: item.item_meta.note,
        };
      } else if (addee_list.addee.morphType === "Set") {
        relations = [
          "itemConnector",
          "itemConnector.item",
          "itemConnector.item.item_meta",
        ];
        return await getRepository(addee_list.addee.morphType).findOneOrFail(
          addee_list.addee.morphId,
          {
            relations: relations,
          }
        );
      }
    });
  }
}

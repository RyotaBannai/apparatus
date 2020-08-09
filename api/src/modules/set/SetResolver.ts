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
import { Item } from "../../entity/Item";
import { Set } from "../../entity/Set";
import { Workspace } from "../../entity/Workspace";
import { SetWorkspace } from "../../entity/SetWorkspace";
import { getSetArgs, getSetbyIDArgs } from "./TypeDefs";

@Resolver((of) => Set)
export class SetResolver {
  @Query((returns) => Set)
  async getSet(
    @Args() { id }: getSetbyIDArgs,
    @Ctx() ctx: Context
  ): Promise<Set> {
    return await Set.findOneOrFail({
      where: {
        id: id,
        ownerId: ctx.user.id,
      },
    });
  }

  @Query((returns) => [Set])
  async getSets(
    @Args() { wsId }: getSetArgs,
    @Ctx() ctx: Context
  ): Promise<Set[] | undefined> {
    let sets: Set[] = await Set.find({
      where: {
        ownerId: ctx.user.id,
      },
      relations: ["wsConnector", "wsConnector.ws"],
    });
    let sets_in_this_ws: Set[] = [];
    for (const set of sets) {
      let set_wses: SetWorkspace[] = set.wsConnector;
      for (const set_ws of set_wses) {
        if (set_ws.ws.id === wsId) {
          sets_in_this_ws.push(set);
          break;
        }
      }
    }
    return sets_in_this_ws;
  }

  @FieldResolver()
  async items(@Root() set: Set) {
    const this_set: Set = await Set.findOneOrFail(set.id, {
      relations: ["itemConnector", "itemConnector.item"],
    });
    const this_items: Item[] = [];
    for (const { item } of this_set.itemConnector) {
      this_items.push(item);
    }
    return this_items;
  }
}

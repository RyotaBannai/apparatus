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
import { Context } from "vm";
import { ItemMetaHighlight } from "../../entity/ItemMetaHighlight";
import { Set } from "../../entity/Set";
import { getSetArgs, getSetbyIDArgs } from "./TypeDefs";
import { ItemData } from "../item/TypeDefs";

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
      if (set.wsConnector.ws.id === wsId) {
        sets_in_this_ws.push(set);
      }
    }
    return sets_in_this_ws;
  }

  @FieldResolver()
  async items(@Root() set: Set) {
    const this_set: Set = await Set.findOneOrFail(set.id, {
      relations: [
        "itemConnector",
        "itemConnector.item",
        "itemConnector.item.item_meta",
        "itemConnector.item.item_meta.highlightConnector",
        "itemConnector.item.item_meta.highlightConnector.highlight",
      ],
    });
    const this_items: ItemData[] = [];
    for (const { item } of this_set.itemConnector) {
      this_items.push({
        id: item.id,
        type: item.type,
        data: item.data,
        description: item.item_meta.description ?? "",
        note: item.item_meta.note ?? "",
        highlights: item.item_meta.highlightConnector.map(
          (item_meta_highlight: ItemMetaHighlight) =>
            item_meta_highlight.highlight
        ),
      });
    }
    return this_items;
  }
}

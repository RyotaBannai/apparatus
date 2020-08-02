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
import { getSetbyIDArgs } from "./TypeDefs";

@Resolver((of) => Set)
export class SetResolver {
  @Query((returns) => Set)
  async getSet(
    @Args() { id }: getSetbyIDArgs,
    @Ctx() ctx: Context
  ): Promise<Set> {
    return await Set.findOneOrFail(id);
  }

  @Query((returns) => [Set])
  async getSets(@Ctx() ctx: Context): Promise<Set[] | undefined> {
    return await Set.find({
      where: {
        ownerId: ctx.user.id,
      },
    });
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

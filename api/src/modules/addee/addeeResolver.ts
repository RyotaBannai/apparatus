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
import { Addee, AddeeUnion } from "../../entity/Addee";
import { AddeeList } from "../../entity/AddeeList";
import { getAddessArgs, addAddeesInput } from "./TyepDevs";
import { Item } from "../../entity/Item";
import { Set } from "../../entity/Set";
import { List } from "../../entity/List";

@Resolver((of) => Addee)
export class AddeeResolver {
  @Query((returns) => Addee)
  async getAddee(
    @Args() { id }: getAddessArgs,
    @Ctx() ctx: Context
  ): Promise<Addee> {
    return await Addee.findOneOrFail(id);
  }

  @Mutation(() => Addee)
  async addAddees(@Arg("data") addeestData: addAddeesInput): Promise<List> {
    const this_list: List = await List.findOneOrFail(addeestData.id);
    for (const id of addeestData.addee_ids) {
      const addee_data = {
        morphType: addeestData.addee_type === "items" ? "Item" : "Set",
        morphId: id,
      };
      let [addee, addee_count] = await Addee.findAndCount({
        where: addee_data,
      });
      if (addee_count > 0) continue;

      let new_addee: Addee = await Addee.create(addee_data).save();
      let new_addee_list: AddeeList = new AddeeList();
      new_addee_list.addee = new_addee;
      new_addee_list.list = this_list;
      await getRepository(AddeeList).save(new_addee_list);
    }
    return this_list;
  }

  @FieldResolver()
  async target(@Root() addee: Addee) {
    return await getRepository(addee.morphType).findOneOrFail(addee.morphId);
  }
}

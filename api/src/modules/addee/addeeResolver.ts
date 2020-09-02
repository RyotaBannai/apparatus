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
import { getAddessArgs, addAddeesInputs, deleteAddeesInputs } from "./TyepDevs";
import { Item } from "../../entity/Item";
import { Set } from "../../entity/Set";
import { List } from "../../entity/List";
import { GraphQLResponse } from "../TypeDefsGlobal";
import { Global } from "../../const/constants";

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
  async addAddees(@Arg("data") addeestData: addAddeesInputs): Promise<List> {
    const this_list: List = await List.findOneOrFail(addeestData.id);
    for (const id of addeestData.addee_ids) {
      const addee_data = {
        morphType: addeestData.addee_type === "items" ? "Item" : "Set",
        morphId: id,
      };
      let addees: Addee[] = await Addee.find({
        where: addee_data,
      });

      const addee_lists: (AddeeList | undefined)[] = await Promise.all(
        addees.map((addee: Addee) =>
          getRepository(AddeeList).findOne({
            where: {
              listId: this_list.id,
              addeeId: addee?.id,
            },
          })
        )
      );

      if (
        addees.length === 0 ||
        addee_lists.every((addee_list) => addee_list === undefined)
      ) {
        let new_addee: Addee = await Addee.create(addee_data).save();
        let new_addee_list: AddeeList = new AddeeList();
        new_addee_list.addee = new_addee;
        new_addee_list.list = this_list;
        await getRepository(AddeeList).save(new_addee_list);
      }
    }
    return this_list;
  }

  @Mutation(() => GraphQLResponse)
  async deleteAddees(
    @Arg("data") inputs: deleteAddeesInputs
  ): Promise<GraphQLResponse> {
    const this_list: List = await List.findOneOrFail(inputs.listId);
    for (const id of inputs.itemIds) {
      const addee_data = {
        morphType: "Item",
        morphId: id,
      };
      let addee: Addee = await Addee.findOneOrFail({
        where: addee_data,
      });
      await Addee.remove(addee);
    }
    return { res: Global.SUCCESS };
  }

  @FieldResolver()
  async target(@Root() addee: Addee) {
    return await getRepository(addee.morphType).findOneOrFail(addee.morphId);
  }
}

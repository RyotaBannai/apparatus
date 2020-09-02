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
import { List } from "../../entity/List";
import { GraphQLResponse } from "../TypeDefsGlobal";
import { Global } from "../../const/constants";
import * as _ from "lodash";

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
    const addees_data: Array<[number | undefined, string]> = [
      _.zip(inputs.itemIds, new Array(inputs.itemIds.length).fill("Item")),
      _.zip(inputs.setIds, new Array(inputs.setIds.length).fill("Set")),
    ].flat();
    for (const [id, type] of addees_data) {
      const addee_data = {
        morphType: type,
        morphId: id,
      };
      let addees: Addee[] = await Addee.find({
        where: addee_data,
      });

      const addee_lists: (AddeeList | undefined)[] = (
        await Promise.all(
          addees.map((addee: Addee) =>
            getRepository(AddeeList).findOne({
              where: {
                listId: this_list.id,
                addeeId: addee?.id,
              },
            })
          )
        )
      ).filter((addee_list: AddeeList | undefined) => addee_list !== undefined);
      await Addee.delete(addee_lists[0]?.addeeId!);
    }
    return { res: Global.SUCCESS };
  }

  @FieldResolver()
  async target(@Root() addee: Addee) {
    return await getRepository(addee.morphType).findOneOrFail(addee.morphId);
  }
}

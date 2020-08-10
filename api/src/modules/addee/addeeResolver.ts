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
import { getAddessArgs } from "./TyepDevs";
import { Item } from "../../entity/Item";
import { Set } from "../../entity/Set";

@Resolver((of) => Addee)
export class AddeeResolver {
  @Query((returns) => Addee)
  async getAddee(
    @Args() { id }: getAddessArgs,
    @Ctx() ctx: Context
  ): Promise<Addee> {
    return await Addee.findOneOrFail(id);
  }

  @FieldResolver()
  async target(@Root() addee: Addee) {
    return await getRepository(addee.morphType).findOneOrFail(addee.morphId);
  }
}

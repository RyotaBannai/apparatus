import { Arg, Args, Int, Mutation, Query, Resolver, Ctx } from "type-graphql";
import { getRepository } from "typeorm";
import { highlightInputs } from "./TypeDefs";
import { GraphQLResponse } from "../TypeDefsGlobal";
import { Context } from "vm";
import { Item } from "../../entity/Item";

@Resolver((of) => Item)
export class ItemMetaResolver {
  @Mutation(() => GraphQLResponse)
  async addHighlights(
    @Arg("highlightInputs") inputs: highlightInputs
  ): Promise<Object> {
    console.log(inputs);
    return { res: "Success" };
  }
}

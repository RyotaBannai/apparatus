import { Arg, Args, Int, Mutation, Query, Resolver, Ctx } from "type-graphql";
import { getRepository } from "typeorm";
import { highlightInputs, HighlightsIndexes } from "./TypeDefs";
import { GraphQLResponse } from "../TypeDefsGlobal";
import { Context } from "vm";
import { Item } from "../../entity/Item";
import { Highlight } from "../../entity/Highlight";

type TTargetType = "data" | "description" | "note";

@Resolver((of) => Item)
export class ItemMetaResolver {
  @Mutation(() => GraphQLResponse)
  async addHighlights(
    @Arg("highlightInputs") inputs: highlightInputs
  ): Promise<Object> {
    await Highlight.remove(
      await Highlight.find({
        where: {
          targetId: inputs.id,
        },
      })
    );
    for await (const targetType of ["data", "description", "note"]) {
      await this.saveHighlight(inputs, targetType as TTargetType);
    }
    return { res: "Success" };
  }

  private async saveHighlight(
    inputs: highlightInputs,
    targetType: TTargetType
  ) {
    await Promise.all(
      (inputs[targetType] as HighlightsIndexes[]).map(
        async (index: HighlightsIndexes) => {
          const { start, end } = index;
          await Highlight.create({
            targetId: inputs.id,
            targetType,
            start,
            end,
          }).save();
        }
      )
    );
  }
}

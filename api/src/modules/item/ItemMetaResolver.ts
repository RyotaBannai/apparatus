import { Arg, Args, Int, Mutation, Query, Resolver, Ctx } from "type-graphql";
import { getRepository } from "typeorm";
import { highlightInputs, HighlightsIndexes } from "./TypeDefs";
import { GraphQLResponse } from "../TypeDefsGlobal";
import { Context } from "vm";
import { Item } from "../../entity/Item";
import { ItemMeta } from "../../entity/ItemMeta";
import { Highlight } from "../../entity/Highlight";
import { ItemMetaHighlight } from "../../entity/ItemMetaHighlight";

type TTargetType = "data" | "description" | "note";

@Resolver((of) => Item)
export class ItemMetaResolver {
  @Mutation(() => GraphQLResponse)
  async addHighlights(
    @Arg("highlightInputs") inputs: highlightInputs
  ): Promise<Object> {
    const item_meta: ItemMeta = await getRepository(ItemMeta).findOneOrFail({
      where: {
        itemId: inputs.id,
      },
      relations: ["highlightConnector", "highlightConnector.highlight"],
    });

    for await (const itemMetaHighlight of item_meta.highlightConnector) {
      getRepository(Highlight).remove(itemMetaHighlight.highlight);
    }

    for await (const targetType of ["data", "description", "note"]) {
      await this.saveHighlight(inputs, targetType as TTargetType, item_meta);
    }
    return { res: "Success" };
  }

  private async saveHighlight(
    inputs: highlightInputs,
    targetType: TTargetType,
    item_meta: ItemMeta
  ) {
    const ItemMetaHighlightRepository = getRepository(ItemMetaHighlight);
    await Promise.all(
      (inputs[targetType] as HighlightsIndexes[]).map(
        async (index: HighlightsIndexes) => {
          const { start, end } = index;
          const highlight: Highlight = await Highlight.create({
            targetType,
            start,
            end,
          }).save();
          await ItemMetaHighlightRepository.save(
            ItemMetaHighlightRepository.create({
              itemMeta: item_meta,
              highlight,
            })
          );
        }
      )
    );
  }
}

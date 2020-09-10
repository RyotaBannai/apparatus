import {
  Ctx,
  Field,
  ID,
  Int,
  ObjectType,
  ArgsType,
  InputType,
} from "type-graphql";
import { Min, Max } from "class-validator";
import { Item, ItemType } from "../../entity/Item";
import { Highlight } from "../../entity/Highlight";

@InputType({ description: "New item data" })
export class addItemInput implements Partial<Item> {
  @Field((type) => String)
  data: string;
}

@InputType({ description: "New items data" })
export class addItemInputs implements Partial<Item> {
  @Field((type) => String)
  data: string;
}

@InputType({ description: "Update items data" })
export class updateItemInputs implements Partial<Item> {
  @Field((type) => String)
  data: string;
}

@ArgsType()
export class getItemsArgs {
  @Field((type) => Number)
  wsId: number;
}

@ArgsType()
export class GetItemArgs {
  @Field((type) => Int, { nullable: true })
  @Min(0)
  skip?: number;

  @Field((type) => Int, { nullable: true })
  @Min(1)
  take = 1;

  @Field((type) => Int, { nullable: true })
  current?: string;

  get startIndex(): number {
    if (typeof this.skip === "number" && typeof this.current === "number")
      return this.take * this.current + this.skip;
    else return 0;
  }

  get endIndex(): number {
    return this.startIndex + this.take;
  }
}

@ObjectType()
export class ItemData {
  @Field((type) => ID)
  id: number;

  @Field((type) => String, { nullable: true })
  data: string;

  @Field((type) => String, { nullable: true })
  type: ItemType;

  @Field()
  description: string;

  @Field()
  note: string;

  @Field((type) => Highlight, { nullable: true })
  highlights?: Highlight[];
}

@InputType()
export class HighlightsIndexes {
  @Field((type) => Int)
  start: number;

  @Field((type) => Int)
  end: number;
}

@InputType({ description: "Add highlights to items" })
export class highlightInputs {
  @Field((type) => ID)
  id: number;

  @Field((type) => [HighlightsIndexes])
  data: HighlightsIndexes[];

  @Field((type) => [HighlightsIndexes!]!)
  description: Object[];

  @Field((type) => [HighlightsIndexes!]!)
  note: Object[];
}

export type ItemDataFromEdit = ItemData & { id_on_server: number };

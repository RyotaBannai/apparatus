import {
  Arg,
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Ctx,
  FieldResolver,
  Root,
  createParamDecorator,
} from "type-graphql";
import {
  Item,
  Response,
  addItemInput,
  addItemInputs,
  GetItemArgs,
} from "../../entity/Item";
import { Context } from "vm";
import { List } from "../../entity/List";
import { ItemList } from "../../entity/ItemList";

@Resolver((of) => Item)
export class ItemResolver {
  private itemCollection: Item | Item[] = [];

  @Mutation(() => Item)
  async createItem(
    @Arg("data") newItemData: addItemInput, // client should use data as key and value of object te same as addItemInput type
    @Ctx() ctx: Context
  ): Promise<Item> {
    console.log(ctx); // { _extensionStack: GraphQLExtensionStack { extensions: [] } }
    const new_item = Item.create(newItemData);
    return await new_item.save();
  }

  @Mutation(() => Response)
  async createItems(
    @Arg("data") newItemData: addItemInputs // client should use data as key and value of object te same as addItemInput type
    // ): Promise<Item[]> {
  ): Promise<Object> {
    console.log(newItemData);
    console.log(JSON.parse(newItemData.data));
    //const new_item = Item.create(newItemData);
    //return await new_item.save();
    // .forEach((set: any) => {
    //   set.items.forEach(
    //     (item: itemOrUndefined) =>
    //       (itemsInShape = [
    //         ...itemsInShape,
    //         { ...item, set_id: set.id, set_name: set.name },
    //       ])
    //   );
    // })
    return { res: "ok" };
  }

  @Mutation(() => Item)
  async updateItem(
    @Arg("data") updateItemData: addItemInput,
    @Ctx() ctx: Context
  ): Promise<Item> {
    const item = await Item.findOneOrFail(updateItemData.id);
    const updated = Item.create({
      ...item,
      ...updateItemData,
    });
    await updated.save();
    return await Item.findOneOrFail(item.id, {
      relations: ["listConnector", "listConnector.list"],
    });
  }

  @Query((returns) => [Item])
  async getItems(
    @Args() { startIndex, endIndex }: GetItemArgs
  ): Promise<Item[]> {
    this.itemCollection = await Item.find({
      relations: ["listConnector", "listConnector.list"],
    });
    return this.itemCollection.slice(startIndex, endIndex);
  }

  @Query((returns) => Item)
  async getOneItem(
    @Arg("id") id: number,
    @routinizedFindById() item: Item
  ): Promise<Item | undefined> {
    return item;
  }

  @FieldResolver()
  async list(@Root() item: Item) {
    this.itemCollection = await Item.findOneOrFail(item.id, {
      relations: ["listConnector", "listConnector.list"],
    });
    const this_list: List[] = [];
    for (const { list } of this.itemCollection.listConnector) {
      this_list.push(list);
    }
    return this_list;
  }
}

function getId(params: any): number | undefined {
  if ("id" in params) {
    return Number(params.id);
  } else {
    for (const [key, value] of Object.entries(params)) {
      if (typeof value == "object" && value !== null) {
        return getId(value);
      }
    }
  }
}

function routinizedFindById() {
  return createParamDecorator((params) => {
    let id: number | undefined = getId(params.args);
    return Item.findOneOrFail(id, {
      relations: ["listConnector", "listConnector.list"],
    });
  });
}

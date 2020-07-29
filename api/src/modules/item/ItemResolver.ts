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
import { getRepository } from "typeorm";
import {
  Item,
  Response,
  addItemInput,
  addItemInputs,
  GetItemArgs,
} from "../../entity/Item";
import { Context } from "vm";
import { Set } from "../../entity/Set";
import { ItemSet } from "../../entity/ItemSet";
import { List } from "../../entity/List";
import { ItemList } from "../../entity/ItemList";
import { ItemMeta } from "../../entity/ItemMeta";

@Resolver((of) => Item)
export class ItemResolver {
  private itemCollection: Item | Item[] = [];

  @Mutation(() => Item)
  async createItem(
    @Arg("data") newItemData: addItemInput, // client should use data as key and value of object to same as addItemInput type
    @Ctx() ctx: Context
  ): Promise<Item> {
    console.log(ctx); // { _extensionStack: GraphQLExtensionStack { extensions: [] } }
    const new_item = Item.create(newItemData);
    return await new_item.save();
  }

  @Mutation(() => Response)
  async createItems(@Arg("data") newItemData: addItemInputs): Promise<Object> {
    let sets = JSON.parse(newItemData.data);
    for (const { name, items } of sets) {
      if (items.length > 1) {
        let new_set: Set = Set.create({ name: name });
        await new_set.save();
        for (const item of items) {
          let new_item: Item = await this.saveItem(item);
          let new_item_set: ItemSet = new ItemSet();
          new_item_set.item = new_item;
          new_item_set.set = new_set;
          await getRepository(ItemSet).save(new_item_set);
        }
      } else {
        for (const item of items) {
          this.saveItem(item);
        }
      }
    }
    return { res: "Success" };
  }

  private async saveItem(item: any): Promise<Item> {
    let new_item: Item = Item.create({
      data: item.data,
      type: item.type,
    });
    await new_item.save();

    let new_item_meta: ItemMeta = new ItemMeta();
    new_item_meta.item = new_item;
    new_item_meta.description = item.description;
    new_item_meta.note = item.note;
    await getRepository(ItemMeta).save(new_item_meta);

    return new_item;
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

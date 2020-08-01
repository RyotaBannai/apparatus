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
  Authorized,
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
import { User } from "../../entity/User";
import { Set } from "../../entity/Set";
import { ItemSet } from "../../entity/ItemSet";
import { List } from "../../entity/List";
import { ItemList } from "../../entity/ItemList";
import { ItemWorkspace } from "../../entity/ItemWorkspace";
import { Workspace } from "../../entity/Workspace";
import { ItemMeta } from "../../entity/ItemMeta";
import { UserMeta } from "../../entity/UserMeta";

@Resolver((of) => Item)
export class ItemResolver {
  private itemCollection: Item | Item[] = [];

  @Mutation(() => Item)
  async createItem(
    @Arg("data") newItemData: addItemInput, // client should use data as key and value of object to same as addItemInput type
    @Ctx() ctx: Context
  ): Promise<Item> {
    const new_item = Item.create(newItemData);
    return await new_item.save();
  }

  @Mutation(() => Response)
  async createItems(
    @Arg("data") newItemData: addItemInputs,
    @Ctx() ctx: Context
  ): Promise<Object> {
    let sets = JSON.parse(newItemData.data);
    let request_user: User = await User.findOneOrFail(ctx.user.id, {
      relations: ["user_meta"],
    });
    for (const { name, items, ws_id } of sets) {
      const this_workspace: Workspace = await Workspace.findOneOrFail(ws_id);
      if (items.length > 1) {
        let new_set: Set = Set.create({ name: name });
        await new_set.save();
        for (const item of items) {
          let new_item: Item = await this.saveItem(
            item,
            request_user.user_meta,
            this_workspace
          );
          let new_item_set: ItemSet = new ItemSet();
          new_item_set.item = new_item;
          new_item_set.set = new_set;
          await getRepository(ItemSet).save(new_item_set);
        }
      } else {
        for (const item of items) {
          this.saveItem(item, request_user.user_meta, this_workspace);
        }
      }
    }
    return { res: "Success" };
  }

  private async saveItem(
    item: any,
    user_meta: UserMeta,
    workspace: Workspace
  ): Promise<Item> {
    let new_item: Item = Item.create({
      data: item.data,
      type: item.type,
      user_meta: user_meta,
    });
    await new_item.save();

    let new_item_meta: ItemMeta = new ItemMeta();
    new_item_meta.item = new_item;
    new_item_meta.description = item.description;
    new_item_meta.note = item.note;
    await getRepository(ItemMeta).save(new_item_meta);

    let new_item_ws: ItemWorkspace = new ItemWorkspace();
    new_item_ws.item = new_item;
    new_item_ws.ws = workspace;
    await getRepository(ItemWorkspace).save(new_item_ws);

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

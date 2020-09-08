import { Arg, Args, Mutation, Query, Resolver, Ctx } from "type-graphql";
import { getRepository } from "typeorm";
import {
  addItemInput,
  addItemInputs,
  updateItemInputs,
  getItemsArgs,
  ItemData,
  ItemDataFromEdit,
} from "./TypeDefs";
import { GraphQLResponse } from "../TypeDefsGlobal";
import { Context } from "vm";
import { User } from "../../entity/User";
import { UserMeta } from "../../entity/UserMeta";
import { Item } from "../../entity/Item";
import { ItemMeta } from "../../entity/ItemMeta";
import { ItemSet } from "../../entity/ItemSet";
import { ItemWorkspace } from "../../entity/ItemWorkspace";
import { Set } from "../../entity/Set";
import { SetWorkspace } from "../../entity/SetWorkspace";
import { Workspace } from "../../entity/Workspace";
import { Addee } from "../../entity/Addee";
import * as _ from "lodash";

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

  @Mutation(() => GraphQLResponse)
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
        const new_set: Set = await this.createSetAndAddToWS(
          name,
          ctx.user.id,
          this_workspace
        );

        for (const item of items) {
          this.saveItemAndAddToSet(
            item,
            request_user.user_meta,
            this_workspace,
            new_set
          );
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

  private async saveItemAndAddToSet(
    item: any,
    user_meta: UserMeta,
    workspace: Workspace,
    set: Set
  ) {
    let new_item: Item = await this.saveItem(item, user_meta, workspace);
    await this.addItemToSet(new_item, set);
  }

  private async addItemToSet(item: Item, set: Set) {
    let new_item_set: ItemSet = new ItemSet();
    new_item_set.item = item;
    new_item_set.set = set;
    await getRepository(ItemSet).save(new_item_set);
  }

  private async createSetAndAddToWS(
    name: string,
    ownerId: number,
    this_workspace: Workspace
  ): Promise<Set> {
    let new_set: Set = Set.create({ name, ownerId });
    await new_set.save();

    let new_set_ws: SetWorkspace = new SetWorkspace();
    new_set_ws.set = new_set;
    new_set_ws.ws = this_workspace;
    await getRepository(SetWorkspace).save(new_set_ws);

    return new_set;
  }

  @Mutation(() => GraphQLResponse)
  async updateItem(@Arg("data") updateItemData: addItemInput): Promise<Object> {
    let set = JSON.parse(updateItemData.data)[0];
    let request_items = set.items;
    const item = _.head(request_items) as ItemDataFromEdit;
    await this.updateItemData({
      ...item,
      id: Number(item.id_on_server),
    });
    return { res: "Success" };
  }

  @Mutation(() => GraphQLResponse)
  async updateItems(
    @Arg("data") newItemData: updateItemInputs,
    @Ctx() ctx: Context
  ): Promise<Object> {
    let set = JSON.parse(newItemData.data)[0];
    let request_items = set.items;

    await Set.update(set.set_id_on_server, {
      name: set.name,
    });
    for (const item of request_items) {
      const { id_on_server, type, data, description, note } = item;
      await this.updateItemData({
        id: id_on_server,
        type,
        data,
        description,
        note,
      });
    }

    return { res: "Success" };
  }

  private async updateItemData(props: ItemData): Promise<Item> {
    const { id, data, type, description, note } = props;
    let this_item: Item = await Item.findOneOrFail(id);
    this_item.type = type;
    this_item.data = data;
    this_item.save();

    await getRepository(ItemMeta).update(id!, {
      description,
      note,
    });

    return this_item;
  }

  private async deSet(set_id: number) {
    let set: Set = await Set.findOneOrFail(set_id, {
      relations: ["itemConnector", "itemConnector.item"],
    });
    console.log(set);
    if (set.itemConnector.length > 1) return;
    set.remove();
  }

  @Query((returns) => [Item])
  async getItems(@Args() { wsId }: getItemsArgs): Promise<Item[]> {
    const items: Item[] = await Item.find({
      relations: ["item_meta", "wsConnector", "wsConnector.ws"],
    });
    return items.filter((item) => item.wsConnector.ws.id === wsId);
  }

  @Query((returns) => [Item])
  async getPureItems(@Args() { wsId }: getItemsArgs): Promise<Item[]> {
    const items: Item[] = await Item.find({
      relations: [
        "item_meta",
        "wsConnector",
        "wsConnector.ws",
        "setConnector",
        "setConnector.set",
      ],
    });
    return items
      .filter((item) => item.wsConnector.ws.id === wsId)
      .filter((item) => item.setConnector.length === 0);
  }

  @Query((returns) => Item)
  async getItem(@Arg("id") id: number): Promise<Item> {
    return Item.findOneOrFail(id, {
      relations: ["item_meta"],
    });
  }

  @Mutation(() => GraphQLResponse)
  async deleteItem(@Arg("id") id: number): Promise<Object> {
    let this_item: Item = await Item.findOneOrFail(id, {
      relations: ["item_meta"],
    });
    await this_item.remove();

    let this_addess: Addee = await Addee.findOneOrFail({
      where: {
        morphId: id,
        morphType: "Item",
      },
    });
    await this_addess.remove();

    return { res: "Success" };
  }

  @Mutation(() => GraphQLResponse)
  async deleteItems(@Arg("set_id") set_id: number): Promise<Object> {
    let this_set: Set = await Set.findOneOrFail(set_id, {
      relations: ["itemConnector", "itemConnector.item"],
    });
    for (const item_set of this_set.itemConnector) {
      await item_set.item.remove();
    }
    await this_set.remove();

    let this_addess: Addee = await Addee.findOneOrFail({
      where: {
        morphId: set_id,
        morphType: "Set",
      },
    });
    await this_addess.remove();

    return { res: "Success" };
  }
}

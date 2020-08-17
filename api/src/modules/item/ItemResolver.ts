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
import { Item } from "../../entity/Item";
import {
  Response,
  addItemInput,
  addItemInputs,
  updateItemInputs,
  GetItemArgs,
  getItemsArgs,
} from "./TypeDefs";
import { Context } from "vm";
import { User } from "../../entity/User";
import { Set } from "../../entity/Set";
import { ItemSet } from "../../entity/ItemSet";
import { List } from "../../entity/List";
import { ItemWorkspace } from "../../entity/ItemWorkspace";
import { SetWorkspace } from "../../entity/SetWorkspace";
import { Workspace } from "../../entity/Workspace";
import { ItemMeta } from "../../entity/ItemMeta";
import { UserMeta } from "../../entity/UserMeta";
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
        let new_set: Set = Set.create({ name: name, ownerId: ctx.user.id });
        await new_set.save();

        let new_set_ws: SetWorkspace = new SetWorkspace();
        new_set_ws.set = new_set;
        new_set_ws.ws = this_workspace;
        await getRepository(SetWorkspace).save(new_set_ws);

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

  @Mutation(() => Response)
  async updateItems(
    @Arg("data") newItemData: updateItemInputs,
    @Ctx() ctx: Context
  ): Promise<Object> {
    let set = JSON.parse(newItemData.data)[0];
    let request_items = set.items;

    await Set.update(set.set_id_on_server, {
      name: set.name,
    });

    let target_set: Set = await Set.findOneOrFail(set.set_id_on_server, {
      relations: [
        "itemConnector",
        "itemConnector.item",
        "itemConnector.item.item_meta",
        "wsConnector",
        "wsConnector.ws",
      ],
    });

    for (const item_set of target_set.itemConnector) {
      let this_id: number = item_set.item.id;
      let update_data = _.find(request_items, { id_on_server: this_id });

      if (update_data === undefined) {
        item_set.item.remove();
      } else {
        await Item.update(this_id, {
          type: update_data.type,
          data: update_data.data,
        });

        await getRepository(ItemMeta).update(item_set.item.item_meta.itemId, {
          description: update_data.description,
          note: update_data.note,
        });
      }
    }

    let new_items = request_items.filter(
      (item: Partial<Item> & { id_on_server: string }) =>
        !item?.id_on_server || item?.id_on_server === undefined
    );

    if (new_items.length === 0) {
      this.deSet(set.set_id_on_server);
      return { res: "Success" };
    }

    let request_user: User = await User.findOneOrFail(ctx.user.id, {
      relations: ["user_meta"],
    });
    const this_workspace: Workspace = await Workspace.findOneOrFail(
      target_set.wsConnector.ws.id
    );
    for (const item of new_items) {
      let new_item: Item = await this.saveItem(
        item,
        request_user.user_meta,
        this_workspace
      );
      let new_item_set: ItemSet = new ItemSet();
      new_item_set.item = new_item;
      new_item_set.set = target_set;
      await getRepository(ItemSet).save(new_item_set);
    }

    this.deSet(set.set_id_on_server);
    return { res: "Success" };
  }

  private async deSet(set_id: number) {
    let set: Set = await Set.findOneOrFail(set_id, {
      relations: ["itemConnector", "itemConnector.item"],
    });
    if (set.itemConnector.length > 1) return;
    set.remove();
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
      // relations: ["listConnector", "listConnector.list"],
    });
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

  // @Query((returns) => [Item])
  // async getItems(
  //   @Args() { startIndex, endIndex }: GetItemArgs
  // ): Promise<Item[]> {
  //   this.itemCollection = await Item.find({
  //     relations: ["item_meta"],
  //   });
  //   return this.itemCollection.slice(startIndex, endIndex);
  // }

  // @Query((returns) => Item)
  // async getOneItem(
  //   @Arg("id") id: number,
  //   @routinizedFindById() item: Item
  // ): Promise<Item | undefined> {
  //   return item;
  // }

  // @FieldResolver()
  // async list(@Root() item: Item) {
  //   this.itemCollection = await Item.findOneOrFail(item.id, {
  //     relations: ["listConnector", "listConnector.list"],
  //   });
  //   const this_list: List[] = [];
  //   for (const { list } of this.itemCollection.listConnector) {
  //     this_list.push(list);
  //   }
  //   return this_list;
  // }
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

// function routinizedFindById() {
//   return createParamDecorator((params) => {
//     let id: number | undefined = getId(params.args);
//     return Item.findOneOrFail(id, {
//       relations: ["listConnector", "listConnector.list"],
//     });
//   });
// }

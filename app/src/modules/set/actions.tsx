import { makeVar, ReactiveVar } from "@apollo/client";
import { Item, Items, itemOrUndefined } from "../item/actions";
import { getCurrentWS } from "../../modules/workspace/actions";
import * as _ from "lodash";

export interface Set {
  id: number;
  set_id_on_server?: number | null;
  name: string;
  items: Items;
}

type setOrUndefined = Set | undefined;

interface NewItemInput {
  set_id: number;
  set_id_on_server?: number | null;
  name?: string;
  item: Item & { update_data?: string };
  edit_mode?: boolean | undefined;
}

export type Sets = Array<Set | undefined>;

interface Status {
  id: number;
  is_set: boolean;
}

export const setStatus = makeVar<Array<Status>>([]);
export const Sets = makeVar<Sets>([]);
export const setCount = makeVar<number>(0);
export const itemCount = makeVar<number>(0);

export function useSet(sets: ReactiveVar<Sets> = Sets) {
  const if_set_defined = (id: number) => _.find(Sets(), { id: id });

  const deleteItem = (set_id: number, item_id: number) => {
    let closure = (set: Set) =>
      set.items.filter((item: Item) => item.id !== item_id);
    Sets(
      whereUpdateHash<setOrUndefined, typeof closure, string>(
        Sets(),
        closure,
        "items",
        "id",
        String(set_id)
      ).filter((set: any) => set)
    );
    return _.find(Sets(), { id: set_id })?.items.length ?? 0;
  };

  const deleteSetOnEditPage = (set_id_on_server: string | undefined) => {
    Sets(
      Sets().filter((set: any) => set?.set_id_on_server !== set_id_on_server)
    );
  };

  const createSet = (set: Partial<Set> & { id: number }) => {
    let new_set: Set;
    let is_defined = if_set_defined(set.id);
    if (is_defined === undefined) {
      new_set = {
        id: set.id,
        set_id_on_server: set.set_id_on_server ?? null,
        name: set.name ?? "Set",
        items: set.items ?? [],
      };
      Sets([...Sets(), new_set]);
    } else {
      new_set = is_defined;
    }
    return new_set;
  };

  const addateItem = (new_item_input: NewItemInput) => {
    let item = new_item_input.item;
    let this_set: Set | undefined = if_set_defined(new_item_input.set_id);
    if (this_set === undefined) throw "There's not this set.";

    let this_item = _.find(this_set.items, {
      id: item.id,
    });
    let new_items: Item[];

    if (this_item === undefined) {
      let new_item = {
        id: item.id,
        type: item.type ?? "line", // null or undefined
        data: item.data ?? "",
      };

      new_items = [...this_set.items, new_item];
    } else {
      let updated_item: any;
      if (item.update_data === "type") {
        updated_item = { ...this_item, type: item.type };
      } else if (item.update_data === "data") {
        updated_item = { ...this_item, data: item.data };
      } else if (item.update_data === "description") {
        updated_item = { ...this_item, description: item.description };
      } else if (item.update_data === "note") {
        updated_item = { ...this_item, note: item.note };
      } else if (item.update_data === "companion") {
        /* TODO: quiz, highlight, etc. conditionals will be written in here. */
        updated_item = { ...this_item, note: item.note };
      } else {
        console.log("error: addateItem receive an unexpected type of data.");
      }

      new_items = whereUpdateArray<Item, string>(
        this_set.items,
        updated_item,
        "id",
        String(item.id)
      );
    }

    Sets(
      whereUpdateHash<setOrUndefined, Item[], string>(
        Sets(),
        new_items,
        "items",
        "id",
        String(this_set.id)
      )
    );
  };

  const updateName = (id: number, name: string) => {
    Sets(
      whereUpdateHash<setOrUndefined, string, string>(
        Sets(),
        name,
        "name",
        "id",
        String(id)
      )
    );
  };

  const addWSId = (set: Partial<Set>) => ({
    ...set,
    ws_id: getCurrentWS().id,
  });

  const filterSet = (): string => {
    let set = Sets()
      .filter((set: setOrUndefined) => set)
      .map((set: setOrUndefined) => {
        return addWSId({
          ...set,
          items: set?.items.filter((item: itemOrUndefined) => {
            if (item instanceof Object && "data" in item && item["data"] !== "")
              return true;
            else return false;
          }),
        });
      });
    return JSON.stringify(set);
  };

  const cleanSet = () => Sets([]);

  const updateSetStatus = (id: number, set_or_not: boolean) => {
    let new_statuses: Status[];
    let this_status = _.find(setStatus(), { id: id });
    if (this_status !== undefined) {
      new_statuses = whereUpdateHash<Status, boolean, string>(
        setStatus(),
        set_or_not,
        "is_set",
        "id",
        String(id)
      );
    } else {
      new_statuses = [
        ...setStatus(),
        {
          id,
          is_set: set_or_not,
        },
      ];
    }
    setStatus(new_statuses);
  };

  const takeIdForSet = () => setCount(setCount() + 1) && setCount();

  const takeIdForItem = () => itemCount(itemCount() + 1) && itemCount();

  return {
    addateItem,
    deleteItem,
    deleteSetOnEditPage,
    updateName,
    filterSet,
    cleanSet,
    createSet,
    updateSetStatus,
    takeIdForSet,
    takeIdForItem,
  };
}

function whereUpdateArray<T, S extends string>(
  array: T[],
  value: T,
  key: S,
  identifier: S
): T[] {
  return array.map((item: T) => {
    if (_.get(item, key) == identifier) {
      if (typeof value == "function") {
        return value(item);
      } else {
        return value;
      }
    } else {
      return item;
    }
  });
}

function whereUpdateHash<T, V, S extends string>(
  array: T[],
  value: V,
  value_key: S,
  key: S,
  identifier: S
): T[] {
  return array.map((item: T) => {
    if (_.get(item, key) == identifier) {
      if (typeof value == "function") {
        return { ...item, [value_key]: value(item) };
      } else {
        return { ...item, [value_key]: value };
      }
    } else {
      return item;
    }
  });
}

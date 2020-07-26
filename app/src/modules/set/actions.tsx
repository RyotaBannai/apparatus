import { makeVar, ReactiveVar } from "@apollo/client";
import { Item, Items } from "../item/actions";
import * as _ from "lodash";

interface Set {
  id: number;
  items: Items;
}

interface addItem {
  id: number;
  item: Item & { update_data: string };
}

type Sets = Array<Set | undefined>;

export const Sets = makeVar<Sets>([]);

export function useSet(sets: ReactiveVar<Sets> = Sets) {
  const allSets = () => Sets();
  const if_set_defined = (id: number) => _.find(Sets(), { id: id });
  const addSet = (newSet: Set) => {
    if (if_set_defined(newSet.id) === undefined) {
      Sets([...Sets(), newSet]);
    }
  };
  const deleteItem = (id: number, item_id: number) => {
    let sets = Sets()
      .map((set: Set | undefined) => {
        if (set !== undefined && set.id == id) {
          let newItems = set.items.filter((item: Item) => item.id !== item_id);
          if (newItems.length !== 0)
            return {
              id,
              items: newItems,
            };
        } else {
          return set;
        }
      })
      .filter((set: any) => set);
    Sets(sets);
  };
  const addItem = (newItem: addItem) => {
    console.log(newItem);
    let item = newItem.item;
    let this_set: Set;
    let is_defined = if_set_defined(newItem.id);
    if (is_defined === undefined) {
      this_set = { id: newItem.id, items: [] };
      Sets([...Sets(), this_set]);
    } else {
      this_set = is_defined;
    }

    let this_item = _.find(this_set.items, {
      id: item.id,
    });
    let newItems: Item[] | undefined;
    if (this_item === undefined) {
      let newItem = {
        id: item.id,
        type: item.type ?? "line", // null or undefined
        data: item.data ?? "",
      };
      newItems = [...this_set.items, newItem];
    } else {
      let updated_item: Item;
      if (item.update_data === "type") {
        updated_item = { ...this_item, type: item.type };
      } else {
        updated_item = { ...this_item, data: item.data };
      }
      newItems = this_set.items.map((_item: Item) => {
        if (_item.id == item.id) {
          return updated_item;
        } else {
          return _item;
        }
      });
    }
    let updated_set: Set = {
      id: this_set.id,
      items: newItems,
    };
    let sets = Sets().map((set: Set | undefined) => {
      if (set !== undefined && set.id == this_set.id) {
        return updated_set;
      } else {
        return set;
      }
    });
    Sets(sets);
  };
  return { allSets, addItem, deleteItem };
}

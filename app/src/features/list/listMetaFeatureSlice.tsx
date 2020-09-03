import { createSlice } from "@reduxjs/toolkit";
import { whereUpdateArray } from "../../modules/where";
import * as _ from "lodash";

let initialMetaList: ApparatusList.InitialListMeta = {
  addable: {
    add_from: "items",
    targets: {
      items: [],
      sets: [],
    },
    selected_targets: {
      items: [],
      sets: [],
    },
  },
  deletable: {
    selected_targets: {
      items: [],
      sets: [],
    },
  },
};

export const ListMetaFeature = createSlice({
  name: "list_meta",
  initialState: initialMetaList,
  reducers: {
    updateAddableAddFrom: (
      state,
      action: {
        type: string;
        payload: {
          add_from: "items" | "sets";
        };
      }
    ) => {
      state.addable.add_from = action.payload.add_from;
    },

    updateAddableTargets: (
      state,
      action: {
        type: string;
        payload: {
          targets: ApparatusSet.Sets | Item.Items;
        };
      }
    ) => {
      const { targets } = action.payload;
      if (isSets(targets)) {
        state.addable.targets.sets = targets;
      }
      if (isItems(targets)) {
        state.addable.targets.items = targets;
      }
    },

    addSelectedTargetToAddable: (
      state,
      action: {
        type: string;
        payload: {
          id: number;
          add_to: "items" | "sets";
        };
      }
    ) => {
      const { id, add_to } = action.payload;
      if (add_to === "items") {
        state.addable.selected_targets.items = [
          ...state.addable.selected_targets.items,
          id,
        ];
      } else if (add_to === "sets") {
        state.addable.selected_targets.sets = [
          ...state.addable.selected_targets.sets,
          id,
        ];
      }
    },

    removeUnSelectedTargetToAddable: (
      state,
      action: {
        type: string;
        payload: {
          id: number;
          add_to: "items" | "sets";
        };
      }
    ) => {
      const { id, add_to } = action.payload;
      if (add_to === "items") {
        state.addable.selected_targets.items = state.addable.selected_targets.items.filter(
          (item_id: number) => item_id !== id
        );
      } else if (add_to === "sets") {
        state.addable.selected_targets.sets = state.addable.selected_targets.sets.filter(
          (set_id: number) => set_id !== id
        );
      }
    },

    addSelectedTargetToDeletable: (
      state,
      action: {
        type: string;
        payload: {
          id: number;
          add_to: "items" | "sets";
        };
      }
    ) => {
      const { id, add_to } = action.payload;
      if (add_to === "items") {
        state.deletable.selected_targets.items = [
          ...state.deletable.selected_targets.items,
          id,
        ];
      } else if (add_to === "sets") {
        state.deletable.selected_targets.sets = [
          ...state.deletable.selected_targets.sets,
          id,
        ];
      }
    },

    removeUnSelectedTargetToDeletable: (
      state,
      action: {
        type: string;
        payload: {
          id: number;
          add_to: "items" | "sets";
        };
      }
    ) => {
      const { id, add_to } = action.payload;
      if (add_to === "items") {
        state.deletable.selected_targets.items = state.deletable.selected_targets.items.filter(
          (item_id: number) => item_id !== id
        );
      } else if (add_to === "sets") {
        state.deletable.selected_targets.sets = state.deletable.selected_targets.sets.filter(
          (set_id: number) => set_id !== id
        );
      }
    },
  },
});

function isSets(targets: any[]): targets is ApparatusSet.Sets {
  if (!targets?.length || targets?.length === 0) return false;
  const target = _.head(targets);
  return "name" in target && "items" in target;
}

function isItems(
  targets: any[]
): targets is Array<Item.Item & { item_meta: Item.ItemMeta }> {
  if (!targets?.length || targets.length === 0) return false;
  const target = _.head(targets);
  return "type" in target && "data" in target;
}

export const useListMetaActions = () => ListMetaFeature.actions;
export default ListMetaFeature.reducer;

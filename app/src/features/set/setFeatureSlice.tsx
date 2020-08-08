import {
  createSlice,
  createAction,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { useSetHelpers } from "./setHelpers";
import {
  whereUpdateArray,
  whereUpdateHash,
  whereUpdateHashes,
} from "../../modules/where";
import * as _ from "lodash";

let initialSets: ApparatusSet.InitialSets = {
  new: [],
  edit: [],
};
// const { addWSId } = useSetHelpers;
export const SetFeature = createSlice({
  name: "set",
  initialState: initialSets,
  reducers: {
    createSet: (
      state,
      action: {
        type: string;
        payload: Partial<ApparatusSet.Set> & { id: number };
      }
    ) => {
      let set = action.payload;
      let new_set: ApparatusSet.Set;
      let is_defined = _.find(state.new, { id: set.id });
      if (is_defined === undefined) {
        new_set = {
          id: set.id,
          set_id_on_server: set.set_id_on_server ?? null,
          name: set.name ?? "Set",
          items: set.items ?? [],
          show: true,
        };
        state.new = [...state.new, new_set];
      }
    },

    addateItem: (
      state,
      action: {
        type: string;
        payload: ApparatusSet.NewItemInput;
      }
    ) => {
      let item = action.payload.item;
      let this_set: ApparatusSet.SetOrUndefined = _.find(state.new, {
        id: action.payload.set_id,
      });
      console.log("in");
      if (this_set === undefined) throw "There's not this set.";

      let this_item = _.find(this_set.items, {
        id: item.id,
      });
      let new_items: Item.Items;

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

        new_items = whereUpdateArray<Item.Item, string>(
          this_set.items,
          updated_item,
          "id",
          String(item.id)
        );
      }

      state.new = whereUpdateHash<
        ApparatusSet.SetOrUndefined,
        Item.Items,
        string
      >(state.new, new_items, "items", "id", String(this_set.id));
    },

    deleteItem: (
      state,
      action: {
        type: string;
        payload: { set_id: number; item_id: number };
      }
    ) => {
      let setItemClosure = (set: ApparatusSet.Set) =>
        set.items.filter(
          (item: Item.Item) => item.id !== action.payload.item_id
        );

      let checkItemsLengthClosure = (set: ApparatusSet.Set) =>
        set.items.length > 0 ? true : false;

      let params = [
        { key: "items", value: setItemClosure },
        { key: "show", value: checkItemsLengthClosure },
      ];

      state.new = whereUpdateHashes<ApparatusSet.SetOrUndefined, string>(
        state.new,
        params,
        "id",
        String(action.payload.set_id)
      );
    },

    updateName: (
      state,
      action: {
        type: string;
        payload: { id: number; name: string };
      }
    ) => {
      state.new = whereUpdateHash<ApparatusSet.SetOrUndefined, string, string>(
        state.new,
        action.payload.name,
        "name",
        "id",
        String(action.payload.id)
      );
    },
    cleanNewSets: (state, action) => {
      state.new = initialSets.new;
    },

    cleanEditSets: (state, action) => {
      state.edit = initialSets.edit;
    },
  },
});

// const deleteItemAndReturnLeft = createAsyncThunk(
//   "set/deleteItemAndReturnLeft",
//   async (args, { getState, requestId, dispatch }) => {
//     await dispatch(SetFeature.actions.deleteItem);
//   }
// );

export const useSetActions = () => SetFeature.actions;
export default SetFeature.reducer;

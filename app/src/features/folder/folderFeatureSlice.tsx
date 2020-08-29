import { createSlice } from "@reduxjs/toolkit";
import { whereUpdateArray } from "../../modules/where";
import * as _ from "lodash";

interface IState {
  addable: {
    is_addable: boolean;
    lists: ApparatusList.ListData[];
    selected_lists: string[];
  };
}
let initialState: IState = {
  addable: {
    is_addable: false,
    lists: [],
    selected_lists: [],
  },
};

export const FolderFeature = createSlice({
  name: "folder",
  initialState,
  reducers: {
    toggleAddableState: (
      state,
      action: {
        type: string;
        payload: {
          is_addable: boolean;
        };
      }
    ) => {
      state.addable.is_addable = action.payload.is_addable;
    },

    updateLists: (
      state,
      action: {
        type: string;
        payload: {
          lists: ApparatusList.ListData[];
        };
      }
    ) => {
      state.addable.lists = [
        ...state.addable.lists,
        action.payload.lists,
      ] as ApparatusList.ListData[];
    },

    addSelectedList: (
      state,
      action: {
        type: string;
        payload: {
          list_id: string;
        };
      }
    ) => {
      state.addable.selected_lists = [
        ...state.addable.selected_lists,
        action.payload.list_id,
      ];
    },

    removeSelectedList: (
      state,
      action: {
        type: string;
        payload: {
          list_id: string;
        };
      }
    ) => {
      state.addable.selected_lists = state.addable.selected_lists.filter(
        (list_id: string) => list_id !== action.payload.list_id
      );
    },
  },
});

export const useFolderActions = () => FolderFeature.actions;
export default FolderFeature.reducer;

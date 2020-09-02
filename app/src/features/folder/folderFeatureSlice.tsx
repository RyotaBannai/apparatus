import { createSlice } from "@reduxjs/toolkit";
import { whereUpdateArray } from "../../modules/where";
import * as _ from "lodash";

interface IState {
  addable: {
    lists: ApparatusList.ListData[];
    selected_lists: string[];
  };
  deletable: {
    selected_lists: string[];
  };
}
let initialState: IState = {
  addable: {
    lists: [],
    selected_lists: [],
  },
  deletable: {
    selected_lists: [],
  },
};

export const FolderFeature = createSlice({
  name: "folder",
  initialState,
  reducers: {
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

    addSelectedListToAddable: (
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

    removeSelectedListToAddable: (
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

    addSelectedListToDeletable: (
      state,
      action: {
        type: string;
        payload: {
          list_id: string;
        };
      }
    ) => {
      state.deletable.selected_lists = [
        ...state.deletable.selected_lists,
        action.payload.list_id,
      ];
    },

    removeSelectedListToDeletable: (
      state,
      action: {
        type: string;
        payload: {
          list_id: string;
        };
      }
    ) => {
      state.deletable.selected_lists = state.deletable.selected_lists.filter(
        (list_id: string) => list_id !== action.payload.list_id
      );
    },
  },
});

export const useFolderActions = () => FolderFeature.actions;
export default FolderFeature.reducer;

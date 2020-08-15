import { createSlice } from "@reduxjs/toolkit";
import { whereUpdateArray } from "../../modules/where";
import * as _ from "lodash";

let initialMetaList: ApparatusList.InitialListMeta = {
  hover_states: [],
};

export const ListMetaFeature = createSlice({
  name: "list_meta",
  initialState: initialMetaList,
  reducers: {
    updateHoverState: (
      state,
      action: {
        type: string;
        payload: ApparatusList.ListHoverState;
      }
    ) => {
      const { id, is_hover } = action.payload;
      state.hover_states = whereUpdateArray<
        ApparatusList.ListHoverState,
        string
      >(
        state.hover_states,
        {
          id,
          is_hover,
        },
        "id",
        String(id)
      );
    },
  },
});

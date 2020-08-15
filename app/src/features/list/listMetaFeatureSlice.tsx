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
    addateHoverState: (
      state,
      action: {
        type: string;
        payload: ApparatusList.ListHoverState;
      }
    ) => {
      const { id, is_hover } = action.payload;
      let this_hover_state: ApparatusList.ListHoverState = _.find(
        state.hover_states,
        {
          id,
        }
      ) as ApparatusList.ListHoverState;
      if (this_hover_state === undefined) {
        state.hover_states = [...state.hover_states, { id, is_hover }];
      } else {
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
      }
    },
  },
});

export const useListMetaActions = () => ListMetaFeature.actions;
export default ListMetaFeature.reducer;

import { createSlice } from "@reduxjs/toolkit";
import * as _ from "lodash";

let initialWS: Workspace.Workspace = {
  name: "Workspace",
  description: "Describe this workspace. (ex: Chinese)",
};

export const WSFeature = createSlice({
  name: "workspace",
  initialState: initialWS,
  reducers: {
    addateWS: (
      state,
      action: {
        type: string;
        payload: Partial<Workspace.Workspace> & { type: string };
      }
    ) => {
      let new_WS: any = {};
      if (action.payload.type === "name") {
        new_WS = {
          ...state,
          name: action.payload.name,
        };
      } else {
        new_WS = {
          ...state,
          description: action.payload.description,
        };
      }
      return new_WS;
    },
  },
});

export const useWSActions = () => WSFeature.actions;
export default WSFeature.reducer;

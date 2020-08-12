import { createSlice } from "@reduxjs/toolkit";
import { whereUpdateArray } from "../../modules/where";
import * as _ from "lodash";

let initialList: ApparatusList.ListState = {
  new: {
    name: "List",
    description: "",
  },
  edit: [],
};

type AddDateListActionPayload = Partial<ApparatusList.List> & {
  id?: number | string;
  id_on_server?: string;
  type: string;
  mode: Global.Mode;
};

const updateList = (
  new_data: { type: string; list: ApparatusList.List } & Partial<
    ApparatusList.List
  >
) => {
  const { type, list, name, description } = new_data;
  if (type === "name") {
    return {
      ...list,
      name,
    };
  } else if (type === "description") {
    return {
      ...list,
      description,
    };
  } else {
    console.log("this type is not supported");
    return;
  }
};

export const ListFeature = createSlice({
  name: "list",
  initialState: initialList,
  reducers: {
    addateList: (
      state,
      action: {
        type: string;
        payload: AddDateListActionPayload;
      }
    ) => {
      const {
        name,
        description,
        type,
        mode,
        id,
        id_on_server,
      } = action.payload;

      if (mode === "edit" && id === undefined) {
        let list: ApparatusList.List | undefined = _.find(state.edit, {
          id_on_server: id,
        });

        if (list === undefined) {
          state.edit = [
            ...state.edit,
            {
              name,
              description,
              id_on_server,
            },
          ] as ApparatusList.Lists;
        } else {
          state.edit = whereUpdateArray<ApparatusList.List, string>(
            state.edit,
            updateList({ type, name, list }) as ApparatusList.List,
            "id_on_server",
            id_on_server as string
          );
        }
      } else if (mode === "new") {
        state.new = updateList({
          type,
          name,
          description,
          list: state.new,
        }) as ApparatusList.List;
      } else {
        console.log("this mode is not supported, or you must provide List Id");
        return state;
      }
    },
  },
});

export const useListActions = () => ListFeature.actions;
export default ListFeature.reducer;

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

const updateList = (
  new_data: { list: ApparatusList.List } & Partial<ApparatusList.List>
) => {
  const { list, name, description } = new_data;
  let updated_list: Partial<ApparatusList.ListData> = list;
  if (name !== undefined) {
    updated_list = {
      ...updated_list,
      name,
    };
  }
  if (description !== undefined) {
    updated_list = {
      ...updated_list,
      description,
    };
  }
  return updated_list;
};

export const ListFeature = createSlice({
  name: "list",
  initialState: initialList,
  reducers: {
    addateList: (
      state,
      action: {
        type: string;
        payload: ApparatusList.AddateListActionPayload;
      }
    ) => {
      const {
        name,
        description,
        mode,
        id,
        id_on_server,
        targets,
      } = action.payload;
      if (mode === "edit" && id !== undefined) {
        let list: ApparatusList.List = _.find(state.edit, {
          id: id,
        }) as ApparatusList.List;
        if (list === undefined) {
          state.edit = [
            ...state.edit,
            {
              id,
              id_on_server,
              name,
              description,
              targets,
            },
          ] as ApparatusList.Lists;
        } else {
          state.edit = whereUpdateArray<ApparatusList.List, string>(
            state.edit,
            updateList({ name, description, list }) as ApparatusList.List,
            "id",
            String(id)
          );
        }
      } else if (mode === "new") {
        state.new = updateList({
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

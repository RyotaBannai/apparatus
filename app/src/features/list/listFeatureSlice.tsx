import { createSlice } from "@reduxjs/toolkit";
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
  if (name !== undefined) {
    return {
      ...list,
      name,
    };
  } else if (description !== undefined) {
    return {
      ...list,
      description,
    };
  } else {
    console.log("this type is not supported");
    return list;
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
      console.log(action.payload);
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
          state.edit = [
            ...state.edit,
            {
              id,
              id_on_server,
              targets,
              ...updateList({ name, description, list }),
            } as ApparatusList.List,
          ];
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

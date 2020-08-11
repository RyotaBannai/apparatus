import { createSlice } from "@reduxjs/toolkit";

let initialList: ApparatusList.List = {
  name: "List",
  description: "",
};

export const ListFeature = createSlice({
  name: "list",
  initialState: initialList,
  reducers: {
    addateList: (
      state,
      action: {
        type: string;
        payload: Partial<ApparatusList.List> & { type: string };
      }
    ) => {
      const { name, description, type } = action.payload;
      if (type === "name") {
        return {
          ...state,
          name,
        } as ApparatusList.List;
      } else if (type === "description") {
        return {
          ...state,
          description,
        } as ApparatusList.List;
      }
    },
  },
});

export const useListActions = () => ListFeature.actions;
export default ListFeature.reducer;

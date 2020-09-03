import { createSlice } from "@reduxjs/toolkit";

interface IState {
  tabState: ETab;
}

enum ETab {
  Item,
  Set,
}

let initialState: IState = {
  tabState: ETab.Item,
};
export const ItemFeature = createSlice({
  name: "item",
  initialState,
  reducers: {
    switchTabState: (
      state,
      action: {
        type: string;
        payload: {
          tab: ETab;
        };
      }
    ) => {
      state.tabState = action.payload.tab;
    },
  },
});

export const useItemActions = () => ItemFeature.actions;
export default ItemFeature.reducer;

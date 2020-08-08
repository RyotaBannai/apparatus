import { createSlice } from "@reduxjs/toolkit";

export const ItemFeature = createSlice({
  name: "item",
  initialState: {},
  reducers: {},
});
export const useItem = () => ItemFeature.actions;
export default ItemFeature.reducer;

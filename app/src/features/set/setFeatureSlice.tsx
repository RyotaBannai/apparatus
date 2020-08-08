import { createSlice } from "@reduxjs/toolkit";

let initialSets: ApparatusSet.InitialSets = {
  new: [],
  edit: [],
};

export const SetFeature = createSlice({
  name: "set",
  initialState: {},
  reducers: {},
});
export const useSet = () => SetFeature.actions;
export default SetFeature.reducer;

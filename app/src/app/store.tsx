import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
// import logger from "redux-logger";
import ItemFeature from "../features/item/itemFeatureSlice";
import SetFeature from "../features/set/setFeatureSlice";
import WSFeature from "../features/workspace/wsFeatureSlice";
import ListFeature from "../features/list/listFeatureSlice";
import ListMetaFeature from "../features/list/listMetaFeatureSlice";
import FolderFeature from "../features/folder/folderFeatureSlice";

const rootReducer = combineReducers({
  item: ItemFeature,
  set: SetFeature,
  workspace: WSFeature,
  list: ListFeature,
  list_meta: ListMetaFeature,
  folder: FolderFeature,
});

// export const setupStore = () => {
const middlewares = [...getDefaultMiddleware()];

export const store = configureStore({
  reducer: rootReducer,
  middleware: middlewares,
});
// return store;
// };

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

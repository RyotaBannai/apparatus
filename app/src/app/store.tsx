import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import logger from "redux-logger";
import SetFeature from "../features/set/setFeatureSlice";
import WSFeature from "../features/workspace/wsFeatureSlice";
import ListFeature from "../features/list/listFeatureSlice";

const rootReducer = combineReducers({
  set: SetFeature,
  workspace: WSFeature,
  list: ListFeature,
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

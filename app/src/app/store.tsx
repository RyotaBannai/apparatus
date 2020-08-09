import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import logger from "redux-logger";
import SetFeature from "../features/set/setFeatureSlice";
import WSFeature from "../features/workspace/wsFeatureSlice";

const rootReducer = combineReducers({
  set: SetFeature,
  workspace: WSFeature,
});

// export const setupStore = () => {
const middlewares = [...getDefaultMiddleware(), logger];

export const store = configureStore({
  reducer: rootReducer,
  middleware: middlewares,
});
// return store;
// };

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

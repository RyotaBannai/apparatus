import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import logger from "redux-logger";
import SetFeature from "../features/set/setFeatureSlice";

const rootReducer = combineReducers({
  set: SetFeature,
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

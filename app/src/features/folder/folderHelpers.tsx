import { makeVar } from "@apollo/client";
import * as _ from "lodash";

export const useFolderHelpers = {
  getAddable: (state: Global.RootState) => state.folder.addable,
};

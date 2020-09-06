import { makeVar } from "@apollo/client";

export const useFolderHelpers = {
  getAddable: (state: Global.RootState) => state.folder.addable,

  getDeletable: (state: Global.RootState) => state.folder.deletable,
};

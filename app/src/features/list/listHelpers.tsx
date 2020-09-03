import { makeVar } from "@apollo/client";
import * as _ from "lodash";

export const listCount = makeVar<number>(0);

export const useListHelpers = {
  getNewList: (state: Global.RootState) => state.list.new,

  getEditLists: (state: Global.RootState) => state.list.edit,

  getListMeta: (state: Global.RootState) => state.list_meta,

  getAddable: (state: Global.RootState) => state.list_meta.addable,

  getDeletable: (state: Global.RootState) => state.list_meta.deletable,

  getAddableTargets: (state: Global.RootState) =>
    state.list_meta.addable.targets,

  getAddableAddFrom: (state: Global.RootState) =>
    state.list_meta.addable.add_from,

  getAddableSelected: (state: Global.RootState) =>
    state.list_meta.addable.selected_targets,

  getListByKey: (
    lists: ApparatusList.Lists,
    { key_name, key }: { key_name: string; key: number | string | undefined }
  ) =>
    _.find(lists, {
      [key_name]: key,
    }) as ApparatusList.ListData,

  takeIdForList: () => listCount(listCount() + 1) && listCount(),
};

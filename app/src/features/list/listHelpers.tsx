import { makeVar, ReactiveVar } from "@apollo/client";
import * as _ from "lodash";

export const listCount = makeVar<number>(0);

export const useListHelpers = {
  getNewList: (state: Global.RootState) => state.list.new,

  getEditLists: (state: Global.RootState) => state.list.edit,

  getListByKey: (
    lists: ApparatusList.Lists,
    { key_name, key }: { key_name: string; key: number | string | undefined }
  ) =>
    _.find(lists, {
      [key_name]: key,
    }) as ApparatusList.ListData,

  takeIdForList: () => listCount(listCount() + 1) && listCount(),
};

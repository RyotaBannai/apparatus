import { useWSHelpers } from "../../features/workspace/wsHelpers";
import { makeVar, ReactiveVar } from "@apollo/client";
import { whereUpdateArray, whereUpdateHash } from "../../modules/where";
import * as _ from "lodash";

export const setCount = makeVar<number>(0);
export const itemCount = makeVar<number>(0);
export const setStatus = makeVar<Array<ApparatusSet.Status>>([]);

const { getCurrentWS } = useWSHelpers;

export const useSetHelpers = {
  if_set_defined: (state: Global.RootState): boolean => true,

  isSet: (set: ApparatusSet.Set | undefined): boolean =>
    set?.items.length > 1 || false,

  getNewSets: (state: Global.RootState) => state.set.new,

  getEditSets: (state: Global.RootState) => state.set.edit,

  getSetById: (sets: ApparatusSet.Sets, { id }: { id: number }) =>
    _.find(sets, {
      id: id,
    }),

  addWSId: (set: Partial<ApparatusSet.Set>) => ({
    ...set,
    ws_id: getCurrentWS().id,
  }),

  filterSet: (sets: ApparatusSet.Sets | undefined): string => {
    if (sets === undefined) return "";
    let set = sets
      .filter((set: ApparatusSet.SetOrUndefined) => set && set.show === true)
      .map((set: ApparatusSet.SetOrUndefined) => {
        return useSetHelpers.addWSId({
          ...set,
          items: set?.items.filter((item: Item.ItemOrUndefined) => {
            if (item instanceof Object && "data" in item && item["data"] !== "")
              return true;
            else return false;
          }),
        });
      });
    return JSON.stringify(set);
  },

  getItemById: (
    sets: ApparatusSet.Sets,
    { set_id, item_id }: { set_id: number; item_id: number }
  ) => _.find(_.find(sets, { id: set_id })?.items, { id: item_id }),

  takeIdForSet: () => setCount(setCount() + 1) && setCount(),

  takeIdForItem: () => itemCount(itemCount() + 1) && itemCount(),

  updateSetStatus: (id: number, set_or_not: boolean) => {
    let new_statuses: ApparatusSet.Status[];
    let this_status = _.find(setStatus(), { id: id });
    if (this_status !== undefined) {
      new_statuses = whereUpdateHash<ApparatusSet.Status, boolean, string>(
        setStatus(),
        set_or_not,
        "is_set",
        "id",
        String(id)
      );
    } else {
      new_statuses = [
        ...setStatus(),
        {
          id,
          is_set: set_or_not,
        },
      ];
    }

    setStatus(new_statuses);
  },
};

import { Sets, setStatus } from "../modules/set/actions";
import { workspace, getCurrentWS } from "../modules/workspace/actions";

interface argsType {
  args: Record<string, any> | null;
}

export const policy = {
  typePolicies: {
    Query: {
      fields: {
        sets() {
          return Sets().filter((set) => !set?.set_id_on_server);
        },
        getSet(name: string, { args }: argsType) {
          return Sets().find((set: any) => set?.id === args?.id);
        },
        getSetStatus(name: string, { args }: argsType) {
          return setStatus().find((status) => status.id === args?.id);
        },
        getSetStatuses(name: string, { args }: argsType) {
          return setStatus();
        },
        getItem(_: string, { args }: argsType) {
          return Sets()
            .find((set) => set?.id === args?.set_id)
            ?.items.find((item: Item.Item) => item.id === args?.id);
        },
        l_getWorkspace(_: string, { args }: argsType) {
          return workspace();
        },
        currentWS(_: string, { args }: argsType) {
          return getCurrentWS();
        },
      },
    },
  },
};

import { workspace, getCurrentWS } from "../modules/workspace/actions";

interface argsType {
  args: Record<string, any> | null;
}

export const policy = {
  typePolicies: {
    Query: {
      fields: {
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

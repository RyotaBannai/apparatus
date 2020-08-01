import { makeVar, ReactiveVar } from "@apollo/client";

export interface Workspace {
  name: string;
  description: string;
}
export type workspaceOrUndefined = Workspace | undefined;
export type Workspaces = Workspace[];

export const workspace = makeVar<Workspace>({
  name: "Workspace",
  description: "Describe this workspace. (ex: Chinese)",
});

export const getCurrentWS = (): { id: string | null } => ({
  id: localStorage.getItem("currentWS") ?? null,
});
export const setCurrentWS = (id: string) =>
  localStorage.setItem("currentWS", id);

export function useWorkspace(sets: ReactiveVar<Workspace> = workspace) {
  const addateWS = (new_data: Partial<Workspace> & { type: string }) => {
    let new_WS: any = {};
    if (new_data.type === "name") {
      new_WS = {
        ...workspace(),
        name: new_data.name,
      };
    } else {
      new_WS = {
        ...workspace(),
        description: new_data.description,
      };
    }
    workspace(new_WS);
  };
  return {
    addateWS,
  };
}

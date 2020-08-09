export const useWSHelpers = {
  getWorkspace: (state: Global.RootState) => state.workspace,

  getCurrentWS: (): { id: string | null } => ({
    id: localStorage.getItem("currentWS") ?? null,
  }),

  setCurrentWS: (id: string) => localStorage.setItem("currentWS", id),
};

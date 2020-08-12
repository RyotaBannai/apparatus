export const useListHelpers = {
  getNewList: (state: Global.RootState) => state.list.new,

  getEditLists: (state: Global.RootState) => state.list.edit,
};

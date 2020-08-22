export const returnData = (lists: ApparatusList.ListData[]) =>
  lists.map((list: ApparatusList.ListData) => createData({ ...list }));

export function createData({
  id,
  name,
  description,
  targets,
}: ApparatusList.ListData) {
  return {
    id,
    name,
    description,
    targets_count: targets.length,
  };
}

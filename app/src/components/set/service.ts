export function createData(id: number, name: string, items: Item.Items) {
  return {
    id,
    name,
    items,
    item_count: items.length,
  };
}

export const returnData = (sets: ApparatusSet.Set[]) => {
  let rows: ReturnType<typeof createData>[] = [];
  for (const { id, name, items } of sets) {
    rows = [...rows, createData(id, name, items)];
  }
  return rows;
};

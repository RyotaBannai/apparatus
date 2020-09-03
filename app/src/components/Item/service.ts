export function createData(
  id: number,
  type: string | undefined,
  data: string | undefined,
  item_meta: Item.ItemMeta
): Item.Item {
  return {
    id,
    type,
    data,
    description: item_meta?.description,
    note: item_meta?.note,
  };
}

export const returnData = (
  items: Array<Item.Item & { item_meta: Item.ItemMeta }>
) => {
  let rows: ReturnType<typeof createData>[] = [];
  for (const { id, type, data, item_meta } of items) {
    rows = [...rows, createData(id, type, data, item_meta)];
  }
  return rows;
};

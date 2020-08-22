export function createData(
  id: number,
  type: string | undefined,
  data: string | undefined
): Item.Item {
  return {
    id,
    type,
    data,
  };
}

export const returnData = (items: Item.Items) => {
  let rows: ReturnType<typeof createData>[] = [];
  for (const { id, type, data } of items) {
    rows = [...rows, createData(id, type, data)];
  }
  return rows;
};

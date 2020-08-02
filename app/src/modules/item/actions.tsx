export interface Item {
  id: number;
  id_on_server?: number | undefined;
  type?: string;
  data?: string;
  description?: string;
  note?: string;
}
export type itemOrUndefined = Item | undefined;
export type Items = Item[];

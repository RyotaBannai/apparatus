export interface Item {
  id: number;
  type?: string;
  data?: string;
}
export type itemOrUndefined = Item | undefined;
export type Items = Item[];

import * as _ from "lodash";

export function whereUpdateArray<T, S extends string>(
  array: T[],
  value: T,
  key: S,
  identifier: S
): T[] {
  return array.map((item: T) => {
    if (_.get(item, key) == identifier) {
      if (typeof value == "function") {
        return value(item);
      } else {
        return value;
      }
    } else {
      return item;
    }
  });
}

export function whereUpdateHash<T, V, S extends string>(
  array: T[],
  value: V,
  value_key: S,
  key: S,
  identifier: S
): T[] {
  return array.map((item: T) => {
    if (_.get(item, key) == identifier) {
      if (typeof value == "function") {
        return { ...item, [value_key]: value(item) };
      } else {
        return { ...item, [value_key]: value };
      }
    } else {
      return item;
    }
  });
}

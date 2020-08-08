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

interface WhereUpdateHashesInput<K, V> {
  key: K;
  value: V;
}

export function whereUpdateHashes<T, S extends string>(
  array: T[],
  hashes: WhereUpdateHashesInput<S, string | number | Function>[],
  key: S,
  identifier: S
) {
  return array.map((item: T) => {
    if (_.get(item, key) == identifier) {
      let return_item: T = item;
      for (let { key, value } of hashes) {
        if (typeof value == "function") {
          return_item = { ...return_item, [key]: value(return_item) };
        } else {
          return_item = { ...return_item, [key]: value };
        }
      }
      return return_item;
    } else {
      return item;
    }
  });
}

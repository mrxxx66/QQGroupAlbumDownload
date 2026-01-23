import { toRaw, isRef, isReactive, isProxy } from "vue";

export function deepToRaw<T extends Record<string, unknown>>(sourceObj: T): T {
  const objectIterator = (input: unknown): unknown => {
    if (Array.isArray(input)) {
      return input.map((item) => objectIterator(item)) as unknown;
    }
    if (isRef(input) || isReactive(input) || isProxy(input)) {
      return objectIterator(toRaw(input));
    }
    if (input && typeof input === "object") {
      return Object.keys(input).reduce((acc, key) => {
        (acc as any)[key] = objectIterator((input as any)[key]);
        return acc;
      }, {} as T);
    }
    return input;
  };

  return objectIterator(sourceObj) as T;
}
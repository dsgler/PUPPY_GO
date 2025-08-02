/* eslint-disable @typescript-eslint/no-explicit-any */
export type NestedIterable<T = any> =
  | T
  | NestedIterable[]
  | { [key: string]: NestedIterable<T> };

export function flatten<T = any>(iter: NestedIterable<T>): T[] {
  const ans: T[] = [];

  function helper(iter: any) {
    if (Array.isArray(iter)) {
      for (const ele of iter) {
        helper(ele);
      }
    } else if (typeof iter === 'object' && iter !== null) {
      for (const key in iter) {
        helper(iter[key]);
      }
    } else {
      ans.push(iter);
    }
  }
  helper(iter);
  return ans;
}

export function deflatten<T>(flattened: T[], structure: any) {
  let index = 0;

  function helper(struct: any): any {
    if (Array.isArray(struct)) {
      // If the structure is an array, recursively reconstruct each element
      return struct.map((v) => helper(v));
    } else if (typeof struct === 'object' && struct !== null) {
      // If the structure is an object, recursively reconstruct each key-value pair
      const obj: any = {};
      for (const key in struct) {
        obj[key] = helper(struct[key]);
      }
      return obj;
    } else {
      // If the structure is a primitive, take the next value from the flattened array
      return flattened[index++];
    }
  }

  return helper(structure);
}

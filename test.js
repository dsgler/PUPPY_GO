function flatten(iter) {
  let ans = [];

  function helper(iter) {
    if (Array.isArray(iter)) {
      for (let ele of iter) {
        helper(ele);
      }
    } else if (typeof iter === "object" && iter !== null) {
      for (let key in iter) {
        helper(iter[key]);
      }
    } else {
      ans.push(iter);
    }
  }
  helper(iter);
  return ans;
}

function deflatten(flattened, structure) {
  let index = 0;

  function helper(struct) {
    if (Array.isArray(struct)) {
      // If the structure is an array, recursively reconstruct each element
      return struct.map((v, k) => helper(struct[k]));
    } else if (typeof struct === "object" && struct !== null) {
      // If the structure is an object, recursively reconstruct each key-value pair
      const obj = {};
      for (let key in struct) {
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

// Example usage:
const iter = [1, [2, [3, 4]], { a: 5, b: [6, 7] }];
const flattened = flatten(iter);
console.log("Flattened:", flattened);
const modified = flattened.map((v) => v + 1);
const restored = deflatten(modified, iter);
console.log("Restored:", restored);

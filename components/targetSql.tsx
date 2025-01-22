import * as SQLite from "expo-sqlite";
import { getDB } from "./indexSql";
import Storage from "expo-sqlite/kv-store";

export type targetCheckRow = { date: number; typeId: number };
export type typeRelationRow = { typeId: number; type: string };

export type daylyRowType = number;
export type monothlyRowType = { description: number; children: number[] };
export type yearlyRowType = { description: number; children: number[] };

export type uniRow = daylyRowType[] | monothlyRowType[] | yearlyRowType[];
type IterableNumber =
  | number
  | IterableNumber[]
  | { [key: string]: IterableNumber };
type IterableString =
  | string
  | IterableString[]
  | { [key: string]: IterableString };

export async function createTable(db: SQLite.SQLiteDatabase) {
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS typeRelation (
        typeId INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT UNIQUE NOT NULL
    );`
  );
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS targetCheck (
        date INTEGER NOT NULL,
        typeId INTEGER NOT NULL
    );`
  );
  //   await db.execAsync(
  //     `CREATE TABLE IF NOT EXISTS targets (
  //         durationType INTEGER NOT NULL,
  //         typeIds TEXT NOT NULL
  //     );`
  //   );
}

async function _addType(db: SQLite.SQLiteDatabase, type: string) {
  let statement = await db.prepareAsync(
    `INSERT INTO typeRelation (type) VALUES (?);`
  );
  try {
    await statement.executeAsync([type]);
  } catch (e) {
    console.log(e);
  } finally {
    await statement.finalizeAsync();
  }
}

async function _queryTypeId(
  db: SQLite.SQLiteDatabase,
  type: string
): Promise<number> {
  let statement = await db.prepareAsync(
    `SELECT * FROM typeRelation WHERE type=?;`
  );
  let rows: typeRelationRow[];
  try {
    let ret = await statement.executeAsync([type]);
    rows = (await ret.getAllAsync()) as typeRelationRow[];
    if (rows.length > 1) {
      throw Error("一个typeName不应对应多于一个id");
    } else if (rows.length === 1) {
      return rows[0].typeId;
    } else {
      return -1;
    }
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    await statement.finalizeAsync();
  }
}

export async function getIdByTypename(
  db: SQLite.SQLiteDatabase,
  type: string
): Promise<number> {
  let id = await _queryTypeId(db, type);
  if (id === -1) {
    await _addType(db, type);
    id = await _queryTypeId(db, type);
    if (id === -1) {
      throw Error("加入后仍未找到");
    }
    return id;
  } else {
    return id;
  }
}
export type NestedIterable<T = any> =
  | T
  | NestedIterable[]
  | { [key: string]: NestedIterable<T> };
// | null
// | undefined;

export function flatten<T = any>(iter: NestedIterable<T>): T[] {
  let ans: T[] = [];

  function helper(iter: any) {
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

export function deflatten<T, P>(flattened: T[], structure: any) {
  let index = 0;

  function helper(struct: any): any {
    if (Array.isArray(struct)) {
      // If the structure is an array, recursively reconstruct each element
      return struct.map((v, k) => helper(struct[k]));
    } else if (typeof struct === "object" && struct !== null) {
      // If the structure is an object, recursively reconstruct each key-value pair
      const obj: any = {};
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

export async function getTypenamesByIDs(
  db: SQLite.SQLiteDatabase,
  typeIds: number[]
): Promise<string[]> {
  let statement = await db.prepareAsync(
    `SELECT * FROM typeRelation WHERE typeId=?;`
  );
  let ans: string[] = Array.from({ length: typeIds.length });
  try {
    for (let i = 0; i < typeIds.length; i++) {
      if (typeIds[i] === undefined) {
        ans[i] = "";
        continue;
      }
      let ret = (await (
        await statement.executeAsync([typeIds[i]])
      ).getAllAsync()) as typeRelationRow[];
      if (ret.length !== 1) {
        throw Error("获取到的id数为:" + ret.length);
      }
      ans[i] = ret[0].type;
    }
  } catch (e) {
    throw e;
  } finally {
    await statement.finalizeAsync();
  }
  return ans;
}

export const DAYLY = 0;
export const MONTHLY = 1;
export const YEARLY = 2;

export async function addTypenameByDurationTypeId(
  durationTypeId: number,
  typeDescription: string
) {
  const db = await getDB();
  let typeId = await getIdByTypename(db, typeDescription);
  let key = "durationTypeId_" + durationTypeId;
  let ret = await Storage.getItemAsync(key);
  let arr: number[] = ret ? JSON.parse(ret) : [];
  for (let ele of arr) {
    if (ele === typeId) {
      return;
    }
  }
  arr.push(typeId);
  await Storage.setItemAsync(key, JSON.stringify(arr));
}

export async function deleteTypeIdByDurationTypeId(
  durationTypeId: number,
  typeId: number
) {
  let key = "durationTypeId_" + durationTypeId;
  let ret = await Storage.getItemAsync(key);
  let arr: number[] = ret ? JSON.parse(ret) : [];
  arr = arr.filter((v) => v !== typeId);
  await Storage.setItemAsync(key, JSON.stringify(arr));
  console.log(JSON.stringify(arr));
}

export async function getTargetIdsByDurationTypeId(
  durationTypeId: number
): Promise<uniRow[]> {
  let key = "durationTypeId_" + durationTypeId;
  let ret = await Storage.getItemAsync(key);
  if (!ret) {
    return [];
  }

  let arr: uniRow[] = JSON.parse(ret);
  return arr;
}

// export async function getTargetNamesByDurationTypeId(
//   db: SQLite.SQLiteDatabase,
//   durationTypeId: number
// ): Promise<string[]> {
//   let TargetIds = await getTargetIdsByDurationTypeId(durationTypeId);
//   let TargetNames: string[] = await getTypenamesByIDs(db, TargetIds);
//   return TargetNames;
// }

export async function __setType() {
  // let typeId = await getIdByTypename(db, typeDescription);
  for (let durationTypeId of [0, 1, 2]) {
    let key = "durationTypeId_" + durationTypeId;
    // let ret = await Storage.getItemAsync(key);
    // let arr: number[] = [[3, 2], [3], [3, 2, 1]][durationTypeId];
    let arr: uniRow;
    switch (durationTypeId) {
      case DAYLY:
        arr = [3, 2, 1];
        break;
      case MONTHLY:
        arr = [
          { description: 4, children: [2, 3] },
          { description: 5, children: [2, 3, 1] },
        ];
        break;
      case YEARLY:
        arr = [{ description: 4, children: [1] }];
        break;
      default:
        throw Error;
    }

    // arr.push(typeId);
    await Storage.setItemAsync(key, JSON.stringify(arr));
  }
}

export async function getFinishsByIds(
  db: SQLite.SQLiteDatabase,
  ids: number[],
  date: number
): Promise<boolean[]> {
  const statement = await db.prepareAsync(
    `SELECT * FROM targetCheck WHERE date=?;`
  );
  let rows: targetCheckRow[];
  try {
    let ret = await statement.executeAsync([date]);
    rows = (await ret.getAllAsync()) as targetCheckRow[];
  } catch (e) {
    throw e;
  } finally {
    await statement.finalizeAsync();
  }
  let se = new Set();
  for (let ele of rows) {
    se.add(ele.typeId);
  }
  return ids.map((v) => se.has(v));
}

export async function setTargetState(
  isFinished: boolean,
  typeId: number,
  date: number
) {
  const db = await getDB();
  if (isFinished) {
    const statement = await db.prepareAsync(`INSERT INTO
  targetCheck (DATE, typeId)
VALUES
  (?, ?);`);
    try {
      await statement.executeAsync([date, typeId]);
    } finally {
      await statement.finalizeAsync();
    }
  } else {
    const statement = await db.prepareAsync(`DELETE FROM targetCheck
WHERE
  DATE = ?
  AND typeId = ?;`);
    try {
      statement.executeAsync([date, typeId]);
    } finally {
      await statement.finalizeAsync();
    }
  }
}

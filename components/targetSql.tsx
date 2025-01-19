import * as SQLite from "expo-sqlite";
import { getDB } from "./indexSql";
import Storage from "expo-sqlite/kv-store";

export type targetCheckRow = { date: number; typeId: number };
export type typeRelationRow = { typeId: number; type: string };

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
    `SELECT * FROM typeRelation WHERE type="?";`
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

export async function getTypenamesByIDs(
  db: SQLite.SQLiteDatabase,
  typeIds: number[]
): Promise<string[]> {
  let statement = await db.prepareAsync(
    `SELECT * FROM typeRelation WHERE typeId="?";`
  );
  let ans: string[] = Array.from({ length: typeIds.length });
  try {
    for (let i = 0; i < typeIds.length; i++) {
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

const DAYLY = 0;
const MONTHLY = 1;
const YEARLY = 2;

export async function addTargetIntoDurationTypeId(
  db: SQLite.SQLiteDatabase,
  durationTypeId: number,
  typeDescription: string
) {
  let typeId = await getIdByTypename(db, typeDescription);
  let key = "durationTypeId_" + durationTypeId;
  let ret = await Storage.getItemAsync(key);
  let arr: number[] = ret ? JSON.parse(ret) : [];
  arr.push(typeId);
  await Storage.setItemAsync(key, JSON.stringify(arr));
}

export async function getTargetIdsByDurationTypeId(
  durationTypeId: number
): Promise<number[]> {
  let key = "durationTypeId_" + durationTypeId;
  let ret = await Storage.getItemAsync(key);
  if (!ret) {
    return [];
  }

  let arr: number[] = JSON.parse(ret);
  return arr;
}

export async function getTargetNamesByDurationTypeId(
  db: SQLite.SQLiteDatabase,
  durationTypeId: number
): Promise<string[]> {
  let TargetIds = await getTargetIdsByDurationTypeId(durationTypeId);
  let TargetNames: string[] = await getTypenamesByIDs(db, TargetIds);
  return TargetNames;
}

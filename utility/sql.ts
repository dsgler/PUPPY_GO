import * as SQLite from "expo-sqlite";

export async function getAllOnce(
  db: SQLite.SQLiteDatabase,
  sql: string,
  params: any[]
) {
  const statement = await db.prepareAsync(sql);
  let rows: unknown[];
  try {
    let ret = await statement.executeAsync(params);
    rows = await ret.getAllAsync();
  } finally {
    await statement.finalizeAsync();
  }
  return rows;
}

export async function getAllMulti(
  db: SQLite.SQLiteDatabase,
  sql: string,
  params: any[][]
) {
  const statement = await db.prepareAsync(sql);
  let rows: unknown[][] = Array.from({ length: params.length });
  try {
    for (let i = 0; i < params.length; i++) {
      let ret = await statement.executeAsync(params[i]);
      rows[i] = await ret.getAllAsync();
    }
  } finally {
    await statement.finalizeAsync();
  }
  return rows;
}

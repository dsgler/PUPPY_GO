import * as SQLite from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

export type addDataType = {
  date: string;
  timestart: string;
  timeend: string;
  sportId: number;
  moodId: number;
  effort: number;
  Tags: string[];
  title: string;
  content: string;
  reply: string;
};

export async function getDB() {
  const db = SQLite.openDatabaseAsync("myDatabase.db");
  return db;
}

export async function createTable(db: SQLite.SQLiteDatabase) {
  return db.execAsync(
    `CREATE TABLE IF NOT EXISTS myTable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date CHARACTER(20) NOT NULL,
        timestart CHARACTER(20) NOT NULL,
        timeend CHARACTER(20) NOT NULL,
        sportId INTEGER NOT NULL,
        moodId INTEGER NOT NULL,
        effort INTEGER NOT NULL,
        Tags TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        reply TEXT NOT NULL
      );`
  );
}

// 插入数据函数
export async function insertData(db: SQLite.SQLiteDatabase, data: addDataType) {
  await createTable(db);
  const {
    date,
    timestart,
    timeend,
    sportId,
    moodId,
    effort,
    Tags,
    title,
    content,
    reply,
  } = data;
  let statement =
    await db.prepareAsync(`INSERT INTO myTable (date, timestart, timeend, sportId, moodId, effort, Tags, title, content, reply) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`);
  try {
    await statement.executeAsync([
      date,
      timestart,
      timeend,
      sportId,
      moodId,
      effort,
      JSON.stringify(Tags),
      title,
      content,
      reply,
    ]);
  } catch (e) {
    console.log(e);
  } finally {
    await statement.finalizeAsync();
  }
}

export async function GetDataByDate(
  db: SQLite.SQLiteDatabase,
  date: string
): Promise<addDataType[]> {
  console.log(date);
  await createTable(db);
  const statement = await db.prepareAsync(
    `SELECT date, timestart, timeend, sportId, moodId, effort, Tags, title, content, reply 
     FROM myTable 
     WHERE date = ?`
  );
  try {
    const result = await statement.executeAsync([date]);
    let ret: addDataType[] = (await result.getAllAsync()) as addDataType[];
    return ret;
  } catch (e) {
    console.log(e);
    return [];
  } finally {
    await statement.finalizeAsync();
  }
}

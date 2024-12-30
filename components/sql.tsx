import * as SQLite from "expo-sqlite";

export type addDataType = {
  date: string;
  timestart: number;
  timeend: number;
  sportId: number;
  moodId: number;
  effort: number;
  Tags: string[];
  title: string;
  content: string;
  reply: string;
};

export function getmulti(Minutes: number) {
  let d = new Date();
  // month 从0开始多少有点逆天
  // let startd = new Date(d.getTime() - 60 * 1000 * Minutes);
  let obj = {
    date: `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`,
    timeend: d.getTime(),
    timestart: d.getTime() - 60 * 1000 * Minutes,
  };
  return obj;
}

export function getTime() {
  let d = new Date();
  return `${d.getHours()}:${d.getSeconds()}`;
}

export function getDate() {
  let d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export async function getDB() {
  const db = SQLite.openDatabaseAsync("myDatabase.db");
  return db;
}

export async function createTable(db: SQLite.SQLiteDatabase) {
  return db.execAsync(
    `CREATE TABLE IF NOT EXISTS myTable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date CHARACTER(20) NOT NULL,
        timestart INTEGER  NOT NULL,
        timeend INTEGER  NOT NULL,
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

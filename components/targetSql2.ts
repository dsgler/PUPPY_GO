import * as SQLite from "expo-sqlite";
import { getDB } from "./indexSql";
import * as consts_frequency from "@/consts/frequency";
import { getDatesByWeek, isSameDay, isWeekday } from "@/utility/datetool";

type targetRowType = {
  Id: number;
  groupId: number;
  description: string;
  makeTime: number;
  duration: number;
  count: number;
  frequency: string;
  sportId: number;
  endTime: number;
};

type frequencyType = {
  typeId: number;
  content: number[];
};

export async function createTable(db: SQLite.SQLiteDatabase) {
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS groupName (
        groupId INTEGER PRIMARY KEY AUTOINCREMENT,
        groupName TEXT UNIQUE NOT NULL
    );`
  );
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS targetCheck (
        date INTEGER NOT NULL,
        targetId INTEGER NOT NULL
    );`
  );

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS targetRow (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      groupId INTEGER NOT NULL,
      description TEXT NOT NULL,
      makeTime INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      count INTEGER NOT NULL,
      frequency TEXT NOT NULL,
      sportId INTEGER NOT NULL,
      endTime INTEGER NOT NULL
    );
  `
  );
}

export async function addTarget(
  db: SQLite.SQLiteDatabase,
  {
    groupId,
    description,
    makeTime,
    duration,
    count,
    frequency,
    sportId,
    endTime,
  }: targetRowType
) {
  const statement = await db.prepareAsync(`
        INSERT INTO targetRow (
          groupId,
          description,
          makeTime,
          duration,
          count,
          frequency,
          sportId,
          endTime
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `);

  try {
    await statement.executeAsync([
      groupId,
      description,
      makeTime,
      duration,
      count,
      frequency,
      sportId,
      endTime,
    ]);
  } finally {
    await statement.finalizeAsync();
  }
}

export async function getTargetsRows(db: SQLite.SQLiteDatabase) {
  let statement = await db.prepareAsync(`SELECT * FROM targetRow;`);
  let ret: targetRowType[];

  try {
    ret = (await (
      await statement.executeAsync()
    ).getAllAsync()) as targetRowType[];
  } finally {
    await statement.finalizeAsync();
  }

  return ret;
}

export async function getTargetsByDay(db: SQLite.SQLiteDatabase, d: Date) {
  let rows = await getTargetsRows(db);
  let ret: targetRowType[] = [];

  for (let ele of rows) {
    let frequency = JSON.parse(ele.frequency) as frequencyType;
    switch (frequency.typeId) {
      case consts_frequency.DAILY:
        ret.push(ele);
        break;
      case consts_frequency.WEEKDAY:
        if (isWeekday(d)) {
          ret.push(ele);
        }
        break;
      case consts_frequency.WEEKEND:
        if (!isWeekday(d)) {
          ret.push(ele);
        }
        break;
      case consts_frequency.COSTUM_MONTH:
        if (frequency.content.includes(d.getMonth())) {
          ret.push(ele);
        }
        break;
      case consts_frequency.COSTUM_WEEK:
        if (frequency.content.includes(d.getDay())) {
          ret.push(ele);
        }
        break;
      case consts_frequency.COSTUM_DAY:
        for (let day of frequency.content) {
          if (isSameDay(d, new Date(day))) {
            ret.push(ele);
            break;
          }
        }
        break;
    }
  }
  return ret;
}

/**
 * 周日是一周的最后一天
 */
export async function getTargetsByWeek(db: SQLite.SQLiteDatabase, d: Date) {
  let rows = await getTargetsRows(db);
  let ret: targetRowType[][] = Array.from({ length: 7 }, () => []);

  let thisWeek = getDatesByWeek(d);

  for (let ele of rows) {
    let frequency = JSON.parse(ele.frequency) as frequencyType;
    switch (frequency.typeId) {
      case consts_frequency.DAILY:
        for (let weekRows of ret) {
          weekRows.push(ele);
        }
        break;
      case consts_frequency.WEEKDAY:
        ret[1].push(ele);
        ret[2].push(ele);
        ret[3].push(ele);
        ret[4].push(ele);
        ret[5].push(ele);
        break;
      case consts_frequency.WEEKEND:
        ret[0].push(ele);
        ret[6].push(ele);
        break;
      case consts_frequency.COSTUM_MONTH:
        for (const requireDate of frequency.content) {
          for (let i = 0; i < 7; i++) {
            if (thisWeek[i].getDate() === requireDate) {
              ret[i].push(ele);
            }
          }
        }
        break;
      case consts_frequency.COSTUM_WEEK:
        for (const w of frequency.content) {
          ret[w].push(ele);
        }
        break;
      case consts_frequency.COSTUM_DAY:
        for (let day of frequency.content) {
          for (let i = 0; i < 7; i++) {
            if (isSameDay(d, thisWeek[i])) {
              ret[i].push(ele);
              break;
            }
          }
        }
        break;
    }
  }
  return ret;
}

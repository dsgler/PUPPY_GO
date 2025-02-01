import * as SQLite from "expo-sqlite";
import * as consts_frequency from "@/consts/frequency";
import {
  getDateNumber,
  getDatesInMonth,
  getDatesInWeek,
  isSameDay,
  isWeekday,
} from "@/utility/datetool";
import { getAllOnce } from "@/utility/sql";

type targetRow = {
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

export type targetCheckRow = { date: number; typeId: number };

export type groupNameRow = { groupId: number; groupName: string };

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
  }: targetRow
) {
  return await getAllOnce(
    db,
    `INSERT INTO targetRow (
        groupId,
        description,
        makeTime,
        duration,
        count,
        frequency,
        sportId,
        endTime
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      groupId,
      description,
      makeTime,
      duration,
      count,
      frequency,
      sportId,
      endTime,
    ]
  );
}

export async function updateTarget(
  db: SQLite.SQLiteDatabase,
  {
    Id,
    groupId,
    description,
    makeTime,
    duration,
    count,
    frequency,
    sportId,
    endTime,
  }: targetRow
) {
  await getAllOnce(
    db,
    `UPDATE targetRow SET groupId=?,description=?,makeTime=?,duration=?,count=?,frequency=?,sportId=?,endTime=? WHERE Id=?;`,
    [
      groupId,
      description,
      makeTime,
      duration,
      count,
      frequency,
      sportId,
      endTime,
      Id,
    ]
  );
}

export async function deleteTarget(db: SQLite.SQLiteDatabase, Id: number) {
  await getAllOnce(db, `DELETE FROM targetRow WHERE Id=?;`, [Id]);
}

export async function getTargetsByDay(db: SQLite.SQLiteDatabase, d: Date) {
  let rows = (await getAllOnce(
    db,
    `SELECT * FROM targetRow;`,
    []
  )) as targetRow[];
  let ret: targetRow[] = [];

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
  let rows = (await getAllOnce(
    db,
    `SELECT * FROM targetRow;`,
    []
  )) as targetRow[];
  let ret: targetRow[][] = Array.from({ length: 7 }, () => []);

  let thisWeek = getDatesInWeek(d);

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
            if (isSameDay(new Date(day), thisWeek[i])) {
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

export async function getProgressByDay(
  db: SQLite.SQLiteDatabase,
  d: Date,
  targetIds: number[]
): Promise<boolean[]> {
  let date = getDateNumber(d);
  let ret = (await getAllOnce(db, `SELECT * FROM targetCheck WHERE date=?;`, [
    date,
  ])) as targetCheckRow[];

  return targetIds.map((v) => {
    for (const ele of ret) {
      if (v === ele.typeId) {
        return true;
      }
    }
    return false;
  });
}

export async function getProgressByWeek() {}

type getProgressByMonthRetRow = {
  groupId: number;
  groupName: string;
  // 0-100
  progress: number;
  children: childrenRow[];
};

type childrenRow = targetRow & { times: number };

export async function getProgressByMonth(db: SQLite.SQLiteDatabase) {
  let d = new Date();
  let groups = (await getAllOnce(
    db,
    `SELECT * FROM groupName;`,
    []
  )) as groupNameRow[];
  let targets = (await getAllOnce(
    db,
    `SELECT * FROM targetRow;`,
    []
  )) as targetRow[];

  let thisMonth = getDatesInMonth(d).map((v) => getDateNumber(v));
  let checks = (await getAllOnce(
    db,
    `SELECT * FROM targetCheck WHERE date>=? AND date<=?;`,
    [thisMonth[0], thisMonth[thisMonth.length - 1]]
  )) as targetCheckRow[];

  let ret: getProgressByMonthRetRow[] = groups.map((v) => ({
    ...v,
    progress: 0,
    children: [],
  }));
  let chi: childrenRow[] = targets.map((v) => ({ ...v, times: 0 }));
  for (let checkRow of checks) {
    let typeId = checkRow.typeId;
    for (let ele of chi) {
      if (ele.Id === typeId) {
        ele.times++;
      }
    }
  }

  for (const ele of chi) {
    for (const retRow of ret) {
      if (retRow.groupId === ele.groupId) {
        retRow.children.push(ele);
      }
    }
  }

  for (const ele of ret) {
    const len = ele.children.length;
    for (const chi of ele.children) {
      ele.progress +=
        chi.count === 0 || chi.times / chi.count >= 1
          ? 100 / len
          : (100 * chi.times) / chi.count / len;
    }
    ele.progress = Math.round(ele.progress);
  }
}

export async function addGroup(db: SQLite.SQLiteDatabase, groupName: string) {
  return await getAllOnce(db, `INSERT INTO groupName (groupName) VALUES (?);`, [
    groupName,
  ]);
}

export async function setCheck(
  db: SQLite.SQLiteDatabase,
  targetId: number,
  date: number = getDateNumber(Date.now())
) {
  let ret = await getAllOnce(
    db,
    `SELECT * FROM targetCheck WHERE date=? AND targetId=?;`,
    [date, targetId]
  );
  if (ret.length !== 0) {
    console.log(ret);
    return;
  }
  await getAllOnce(
    db,
    `INSERT INTO targetCheck (date,targetId) VALUES (?,?);`,
    [date, targetId]
  );
}

export async function cancelCheck(
  db: SQLite.SQLiteDatabase,
  targetId: number,
  date: number = getDateNumber(Date.now())
) {
  await getAllOnce(db, `DELETE FROM targetCheck WHERE date=? AND targetId=?;`, [
    date,
    targetId,
  ]);
}

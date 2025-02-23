import { addDataType } from "@/sqls/indexSql";
import { getAllOnce } from "@/utility/sql";
import { SQLiteDatabase } from "expo-sqlite";

export async function getRows(
  db: SQLiteDatabase,
  startDate: number,
  endDate: number,
  sportId: number
): Promise<addDataType[]> {
  if (sportId === -1) {
    return (await getAllOnce(
      db,
      `SELECT * FROM myTable WHERE date>=? AND date<=?;`,
      [startDate, endDate]
    )) as addDataType[];
  }

  return (await getAllOnce(
    db,
    `SELECT * FROM myTable WHERE date>=? AND date<=? AND sportId=?;`,
    [startDate, endDate, sportId]
  )) as addDataType[];
}

import { effortArr, MoodArr, systemPrompt } from "@/consts";
import { apiKey } from "@/consts/key";
import sportArr from "@/consts/sportType";
import { getGapTimeString } from "@/utility/datetool";
import { getAllOnce } from "@/utility/sql";
import * as SQLite from "expo-sqlite";
import OpenAI from "openai-react-native";

export type addDataType = {
  id?: number;
  date: number;
  timestart: number;
  timeend: number;
  sportId: number;
  moodId: number;
  effort: number;
  // json序列化的
  Tags: string;
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
        date INTEGER NOT NULL,
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
      Tags,
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
  date: number
): Promise<addDataType[]> {
  console.log(date);
  await createTable(db);
  const statement = await db.prepareAsync(
    `SELECT * 
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

type reqStrTyp = {
  运动: string;
  时间: string;
  心情: string;
  耗力: string;
  标签: string;
  日记标题: string;
  日记内容: string;
};
export async function askForReply(
  db: SQLite.SQLiteDatabase,
  data: addDataType,
  setReply: React.Dispatch<React.SetStateAction<string>>
) {
  console.log("准备发送请求");
  const aiclient = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.siliconflow.cn/v1",
    // host: "https://api.siliconflow.cn/v1",
  });

  const reqObj: reqStrTyp = {
    运动: sportArr[data.sportId].sportName,
    时间: getGapTimeString(data.timeend - data.timeend),
    心情: MoodArr[data.moodId].descirption,
    耗力: effortArr[data.effort].s1,
    标签: data.Tags,
    日记标题: data.title,
    日记内容: data.content,
  };
  const reqStr = JSON.stringify(reqObj);
  console.log("发送请求");
  // aiclient.chat.completions
  //   .create({
  //     // model: "deepseek-ai/DeepSeek-R1",
  //     model: "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
  //     messages: [
  //       { role: "system", content: systemPrompt },
  //       { role: "user", content: reqStr },
  //     ],
  //   })
  //   .then((v) => {
  //     console.log(v);
  //     const str = v.choices[0].message.content!;
  //     setStr(str);
  //     updateReply(db, data.id!, str);
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //     setStr("请求失败" + e);
  //   });

  aiclient.chat.completions.stream(
    {
      model: "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: reqStr },
      ],
      max_tokens: 256,
      temperature: 0.3,
    },
    (data) => {
      const c = data.choices[0].delta.content;
      if (c && c.trim() !== "") {
        setReply((prev) => prev + c);
      }
    },
    {
      onError: (error) => {
        console.error("SSE Error:", error); // Handle any errors here
      },
      onOpen: () => {
        console.log("SSE connection for completion opened."); // Handle when the connection is opened
        setReply("");
      },
    }
  );
}

export async function updateReply(
  db: SQLite.SQLiteDatabase,
  id: number,
  reply: string
) {
  return await getAllOnce(
    db,
    `UPDATE myTable
SET
  reply = ?
WHERE
  id = ?;`,
    [reply, id]
  );
}

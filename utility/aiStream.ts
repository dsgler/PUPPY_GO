import OpenAI from "@/utility/Openai";
import { apiKey, baseURL, model } from "@/consts/key";
import * as SQLite from "expo-sqlite";

export async function askForReply({
  db,
  systemPrompt = "",
  reqMessage,
}: {
  db: SQLite.SQLiteDatabase;
  systemPrompt?: string;
  reqMessage: string;
}) {
  const aiclient = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
  });

  console.log("发送请求");

  let fullAnswer = "";
  // 保存用于close
  const es = aiclient.chat.completions.stream(
    {
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: reqMessage },
      ],
      // max_tokens: 256,
      temperature: 0.6,
    },
    (data) => {
      const c = data.choices[0].delta.content;
      console.log(c);
      if (c) {
        fullAnswer += c;
        //   fullAnswer = fullAnswer.replaceAll("\n", "");
        // setReply(fullAnswer + "_");
      }
    },
    {
      onError: (error) => {
        console.error("SSE Error:", error); // Handle any errors here
        // setReply(error);
      },
      onOpen: () => {
        console.log("SSE connection for completion opened."); // Handle when the connection is opened
        // setReply("(思考中)_");
      },
      onDone: () => {
        console.log("done", fullAnswer);
        fullAnswer = fullAnswer.replace(/<think>[^<]+<\/think>/, "");
        // setReply(fullAnswer);
        // updateReply(db, data.id!, fullAnswer);
      },
    }
  );

  return es;
}

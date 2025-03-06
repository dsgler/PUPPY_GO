import { getArr } from "@/utility/getByKey";
import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image } from "react-native";
import { apiKey, baseURL, model } from "@/consts/key";
import OpenAI from "@/utility/Openai";
import { isUseAI } from "@/consts/propmts";
import { MyAlertCtx } from "@/app/_layout";

export function DogsayRow({
  message,
  isLeft,
}: {
  message: string;
  isLeft: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: isLeft ? "row" : "row-reverse",
        marginHorizontal: 16,
        alignItems: "center",
      }}
    >
      <Image
        source={require("@/assets/images/statisticPage/leftHead.png")}
        style={{
          width: 77,
          height: 77,
          transform: isLeft ? [] : [{ scaleX: -1 }],
        }}
      ></Image>
      <View
        style={{
          borderRadius: 10,
          backgroundColor: "#FFF1B0",
          flex: 1,
          paddingVertical: 10,
          paddingHorizontal: 20,
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 14, flex: 1 }}>{message}</Text>
      </View>
    </View>
  );
}
export function DogsayGroup({
  reqStr,
  SystemPrompt,
}: {
  reqStr: string;
  SystemPrompt: string;
}) {
  const [raw, setRaw] = useState("");
  const myAlert = useContext(MyAlertCtx);

  useEffect(() => {
    const es = askForReply({
      reqMessage: reqStr,
      setRaw,
      SystemPrompt,
      onError: myAlert,
    }).catch(myAlert);
    return () => {
      es.then((v) => {
        v?.close();
      });
    };
  }, [SystemPrompt, myAlert, reqStr]);

  let isLeft = false;
  const filteredArr = getArr(raw).map((v, k) => {
    isLeft = !isLeft;
    return <DogsayRow message={v} key={k} isLeft={isLeft} />;
  });

  if (filteredArr.length === 0) {
    return <DogsayRow message={raw} isLeft={true} />;
  } else {
    return <View style={{ gap: 10 }}>{filteredArr}</View>;
  }
}
export async function askForReply({
  reqMessage,
  setRaw,
  SystemPrompt,
  onError,
}: {
  reqMessage: string;
  SystemPrompt: string;
  setRaw: React.Dispatch<React.SetStateAction<string>>;
  onError: (err: Error) => void;
}) {
  if (!isUseAI) {
    return;
  }

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
        { role: "system", content: SystemPrompt },
        { role: "user", content: reqMessage },
      ],
      // max_tokens: 256,
      temperature: 0.6,
    },
    (data) => {
      const c = data.choices[0].delta.content;
      if (c) {
        fullAnswer += c;
        //   fullAnswer = fullAnswer.replaceAll("\n", "");
        setRaw(fullAnswer + "_");
      }
    },
    {
      onError: onError,
      onOpen: () => {
        console.log("SSE connection for completion opened."); // Handle when the connection is opened
        setRaw("(思考中)_");
      },
      onDone: () => {
        console.log("done", fullAnswer);
        // fullAnswer = fullAnswer.replace(/<think>[^<]+<\/think>/, "");
        // setReply(fullAnswer);
        // updateReply(db, data.id!, fullAnswer);
      },
    }
  );

  return es;
}

import { BrandColor } from "@/consts/tabs";
import { View, Image, ActivityIndicator, Text } from "react-native";
import { InfoObjStateCtx, ViewStyle } from "./public";
import { useContext, useEffect } from "react";
import { BodyImproveArr, END, sickArr } from "@/consts/AIplanPage";
import OpenAI from "@/utility/Openai";
import { apiKey, baseURL, model } from "@/consts/key";
import { isUseAI, planReplyType, planSystemPrompt } from "@/consts/propmts";
import {
  addGroupOrGetGroupId,
  addTarget,
  frequencyType,
} from "@/sqls/targetSql2";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";

import * as frequencyConsts from "@/consts/frequency";
import { MyAlertCtx } from "@/app/_layout";

export default function LoadingView({
  StepState: [, setStep],
}: {
  StepState: [number, React.Dispatch<React.SetStateAction<number>>];
}) {
  const [InfoObj, updateInfoObj] = useContext(InfoObjStateCtx);
  const db = useSQLiteContext();
  const myAlert = useContext(MyAlertCtx);

  useEffect(() => {
    let sick = "";
    for (const ele of InfoObj.sick.chosen) {
      sick += sickArr[ele].s1 + sickArr[ele].s2 + "\n";
    }
    sick += InfoObj.sick.attach;

    if (sick === "") {
      sick = "无";
    }

    let impo = "";
    for (const ele of InfoObj.bodyImprove.chosen) {
      impo += BodyImproveArr[ele].description + "\n";
    }
    impo += InfoObj.bodyImprove.attach;

    if (impo === "") {
      impo = "无";
    }

    const messageObj = {
      身高: InfoObj.heightRaw + "cm",
      体重: InfoObj.weightRaw + "kg",
      伤病: sick,
      希望重点加强部位: impo,
    };
    askForPlan(db, JSON.stringify(messageObj), (raw) => {
      setStep(END);
      updateInfoObj((InfoObj) => {
        InfoObj.raw = raw;
      });
    }).catch(myAlert);
  }, [InfoObj, db, myAlert, setStep, updateInfoObj]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: [{ translateY: -50 }],
        }}
      >
        <Image
          source={require("@/assets/images/targetPage/dog.png")}
          style={{ width: 244, height: 244 }}
        />
        <ActivityIndicator size="large" color={BrandColor} />
        <Text style={ViewStyle.mainText}>加载中...</Text>
        <Text style={ViewStyle.subText}>你的智能规划正在生成中…</Text>
      </View>
    </View>
  );
}

async function askForPlan(
  db: SQLiteDatabase,
  message: string,
  onSuccess: (raw: string) => void
) {
  if (!isUseAI) {
    return;
  }

  const aiclient = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
  });

  const cp = await aiclient.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: planSystemPrompt },
      { role: "user", content: message },
    ],
  });

  const raw = cp.choices[0].message.content;
  if (raw === null) {
    throw Error(JSON.stringify(cp));
  }
  const re = /\[.+]/gs;
  const arr = Array.from(raw.matchAll(re));
  const obj = JSON.parse(arr[0][0]) as planReplyType;
  console.log(obj);

  for (const group of obj) {
    const groupId = await addGroupOrGetGroupId(db, group.组名);
    for (const target of group.训练项目) {
      const getFreId = (raw: string): number => {
        if (raw.includes("每天")) {
          return frequencyConsts.DAILY;
        } else if (raw.includes("周中")) {
          return frequencyConsts.WEEKDAY;
        } else if (raw.includes("周末")) {
          return frequencyConsts.WEEKEND;
        }

        return frequencyConsts.DAILY;
      };
      const frequency: frequencyType = {
        typeId: getFreId(target.训练频率),
        content: [],
      };
      await addTarget(db, {
        groupId,
        description: target.项目名,
        count: target.每月目标训练次数,
        duration: 0,
        sportId: -1,
        endTime: -1,
        frequency: JSON.stringify(frequency),
        Id: -1,
        makeTime: Date.now(),
      });
    }
  }

  onSuccess(raw);
}

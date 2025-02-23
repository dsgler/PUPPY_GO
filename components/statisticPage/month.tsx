import { addDataType } from "@/sqls/indexSql";
import { divideMonthIntoWeek, withDate } from "@/utility/datetool";
import { useContext, useEffect, useMemo, useRef } from "react";
import { StyleProp, TextStyle } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import OldPieChart, { Slice } from "react-native-pie-chart";
import { effortArr, MoodArr } from "@/consts";

import * as echarts from "echarts/core";
import { SkiaChart } from "@wuba/react-native-echarts";
import sportArr from "@/consts/sportType";
import * as pageType_consts from "./pageType";
import { MyAlertCtx } from "@/app/_layout";

const CustomeBlockStyle = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginVertical: 10,
  },
  dayText: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
    flex: 1,
    textAlign: "center",
  },
  block: {
    height: 60,
    borderRadius: 6,
    backgroundColor: "#E7E7E7",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  chosenBlock: {
    backgroundColor: "#FDD0A2",
  },
  blockText: {
    fontSize: 16,
  },
  chosenBlockText: {
    color: "white",
  },
  emptyblock: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
});
function CustomeMonthBlock({
  chosen,
  setChosen,
  date,
  dividedArr,
}: {
  chosen?: number[];
  setChosen?: (arr: number[]) => void;
  date: Date;
  dividedArr: (CircleBlockProp | undefined)[][];
}) {
  return (
    <View style={CustomeBlockStyle.container}>
      <View style={{ flexDirection: "row", alignItems: "center", height: 25 }}>
        <Text style={CustomeBlockStyle.dayText}>周一</Text>
        <Text style={CustomeBlockStyle.dayText}>周二</Text>
        <Text style={CustomeBlockStyle.dayText}>周三</Text>
        <Text style={CustomeBlockStyle.dayText}>周四</Text>
        <Text style={CustomeBlockStyle.dayText}>周五</Text>
        <Text style={CustomeBlockStyle.dayText}>周六</Text>
        <Text style={CustomeBlockStyle.dayText}>周日</Text>
      </View>
      <View style={{ gap: 5 }}>
        {dividedArr.map((row, k) => (
          <View key={k} style={{ flexDirection: "row", gap: 3 }}>
            {row.map((v, k) => (
              <View style={CustomeBlockStyle.emptyblock} key={k}>
                {v && <EchartsCircleBlock {...v} />}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

type CircleBlockProp = {
  series: Slice[];
  width: number;
  text: string | number;
  textStyle?: StyleProp<TextStyle>;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function CircleBlock({ series, width, text, textStyle }: CircleBlockProp) {
  return (
    <View>
      <OldPieChart widthAndHeight={width} series={series} cover={0.7} />
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text
          style={[
            { textAlign: "center", textAlignVertical: "center" },
            textStyle,
          ]}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

function EchartsCircleBlock({
  series,
  width,
  text,
  textStyle,
}: CircleBlockProp) {
  const skiaRef = useRef<any>(null);
  useEffect(() => {
    const option = {
      series: [
        {
          type: "pie",
          data: series.map((v) => ({
            value: v.value,
            itemStyle: { color: v.color },
          })),
          radius: ["70%", "100%"],
          label: { show: false },
        },
      ],
    };
    let chart: any;
    if (skiaRef.current) {
      chart = echarts.init(skiaRef.current, "light", {
        renderer: "skia" as any,
        width: width,
        height: width,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [series, width]);

  return (
    <View>
      <SkiaChart ref={skiaRef} />
      <View
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={[{ textAlign: "center" }, textStyle]}>{text}</Text>
      </View>
    </View>
  );
}
type ComposerProps = {
  thisMonth: Date[];
  datas: addDataType[];
};
function MoodComposer({ thisMonth, datas }: ComposerProps) {
  const ans: (CircleBlockProp & withDate)[] = thisMonth.map((v) => {
    const series: Slice[] = MoodArr.map((ele) => ({
      value: 0,
      color: ele.color as string,
    }));
    return { text: v.getDate(), series, width: 35, date: v };
  });

  for (const ele of datas) {
    ans[(ele.date % 100) - 1].series[ele.moodId].value++;
  }

  // 当全空时
  for (const ele of ans) {
    if (ele.series.reduce((prev, cur) => prev + cur.value, 0) === 0) {
      ele.series.push({ value: 1, color: "#D9D9D9" });
    }
  }

  return ans;
}

function DurationComposer({
  thisMonth,
  datas,
}: ComposerProps): (CircleBlockProp & withDate)[] {
  const ans: (CircleBlockProp & withDate)[] = thisMonth.map((v) => {
    const series: Slice[] = sportArr.map((ele) => ({
      value: 0,
      color: ele.color as string,
    }));
    return { text: v.getDate(), series, width: 35, date: v };
  });

  for (const ele of datas) {
    ans[(ele.date % 100) - 1].series[ele.moodId].value++;
  }

  // 当全空时
  for (const ele of ans) {
    if (ele.series.reduce((prev, cur) => prev + cur.value, 0) === 0) {
      ele.series.push({ value: 1, color: "#D9D9D9" });
    }
  }

  return ans;
}

function EffortComposer({ thisMonth, datas }: ComposerProps) {
  const ans: (CircleBlockProp & withDate)[] = thisMonth.map((v) => {
    const series: Slice[] = effortArr.map((ele) => ({
      value: 0,
      color: ele.circolor as string,
    }));
    return { text: v.getDate(), series, width: 35, date: v };
  });

  for (const ele of datas) {
    ans[(ele.date % 100) - 1].series[ele.effort].value++;
  }

  // 当全空时
  for (const ele of ans) {
    if (ele.series.reduce((prev, cur) => prev + cur.value, 0) === 0) {
      ele.series.push({ value: 1, color: "#D9D9D9" });
    }
  }

  return ans;
}

function TagComposer({
  thisMonth,
  datas,
}: ComposerProps): (CircleBlockProp & withDate)[] {
  const dateSet = thisMonth.map(() => false);
  for (const ele of datas) {
    dateSet[(ele.date % 100) - 1] = true;
  }

  const ans: (CircleBlockProp & withDate)[] = thisMonth.map((v, k) => {
    let series: Slice[];
    if (dateSet[k]) {
      series = [{ value: 1, color: "#FFB52B" }];
    } else {
      series = [{ value: 1, color: "#D9D9D9" }];
    }
    return { text: v.getDate(), series, width: 35, date: v };
  });

  return ans;
}

export function MoodWrapper({
  date,
  thisMonth,
  datas,
}: {
  date: Date;
  thisMonth: Date[];
  datas: addDataType[];
}) {
  const composedArr = useMemo(
    () => MoodComposer({ thisMonth, datas }),
    [datas, thisMonth]
  );

  const dividedArr = useMemo(
    () => divideMonthIntoWeek(composedArr),
    [composedArr]
  );

  return <CustomeMonthBlock date={date} dividedArr={dividedArr} />;
}

export function DurationWrapper({
  date,
  thisMonth,
  datas,
}: {
  date: Date;
  thisMonth: Date[];
  datas: addDataType[];
}) {
  const composedArr = useMemo(
    () => DurationComposer({ thisMonth, datas }),
    [datas, thisMonth]
  );

  const dividedArr = useMemo(
    () => divideMonthIntoWeek(composedArr),
    [composedArr]
  );

  return <CustomeMonthBlock date={date} dividedArr={dividedArr} />;
}

export function EffortWrapper({
  date,
  thisMonth,
  datas,
}: {
  date: Date;
  thisMonth: Date[];
  datas: addDataType[];
}) {
  const composedArr = useMemo(
    () => EffortComposer({ thisMonth, datas }),
    [datas, thisMonth]
  );

  const dividedArr = useMemo(
    () => divideMonthIntoWeek(composedArr),
    [composedArr]
  );

  return <CustomeMonthBlock date={date} dividedArr={dividedArr} />;
}

export function TagWrapper({
  date,
  thisMonth,
  datas,
}: {
  date: Date;
  thisMonth: Date[];
  datas: addDataType[];
}) {
  const composedArr = useMemo(
    () => TagComposer({ thisMonth, datas }),
    [datas, thisMonth]
  );

  const dividedArr = useMemo(
    () => divideMonthIntoWeek(composedArr),
    [composedArr]
  );

  return <CustomeMonthBlock date={date} dividedArr={dividedArr} />;
}

export function MonthSwitcher({
  pageType,
  date,
  datas,
  thisMonth,
}: {
  pageType: number;
  date: Date;
  thisMonth: Date[];
  datas: addDataType[];
}) {
  const myAlert = useContext(MyAlertCtx);

  switch (pageType) {
    case pageType_consts.MOOD:
      return <MoodWrapper datas={datas} date={date} thisMonth={thisMonth} />;
    case pageType_consts.DURATION:
      return (
        <DurationWrapper datas={datas} date={date} thisMonth={thisMonth} />
      );
    case pageType_consts.EFFORT:
      return <EffortWrapper datas={datas} date={date} thisMonth={thisMonth} />;
    case pageType_consts.TAG:
      return <TagWrapper datas={datas} date={date} thisMonth={thisMonth} />;
    default:
      myAlert("pageType不存在");
  }
}

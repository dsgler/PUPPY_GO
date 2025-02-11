import { BrandColor, unChoseColor } from "@/consts/tabs";
import { addDataType } from "@/sqls/indexSql";
import { getDateNumber, getDatesInMonth } from "@/utility/datetool";
import { useMemo } from "react";
import { StyleProp, TextStyle } from "react-native";
import { Pressable, View, Text, StyleSheet } from "react-native";
import PieChart, { Slice } from "react-native-pie-chart";
import AntIcon from "react-native-vector-icons/AntDesign";
import { MoodArr } from "@/consts";

const CustomeBlockStyle = StyleSheet.create({
  container: {
    backgroundColor: "#FFFAF3",
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
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
});
export function CustomeMonthBlock({
  chosen,
  setChosen,
  date,
}: {
  chosen?: number[];
  setChosen?: (arr: number[]) => void;
  date: Date;
}) {
  const isDateChanged = date.getMonth();
  const thisMonth = useMemo(
    () => getDatesInMonth(date),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDateChanged]
  );
  const datas: addDataType[] = useMemo(
    () => [
      {
        date: getDateNumber(date),
        timestart: 0,
        timeend: 0,
        sportId: 1,
        moodId: 1,
        effort: 2,
        Tags: "",
        title: "",
        content: "",
        reply: "",
      },
      {
        date: getDateNumber(date),
        timestart: 0,
        timeend: 0,
        sportId: 2,
        moodId: 2,
        effort: 1,
        Tags: "",
        title: "",
        content: "",
        reply: "",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDateChanged]
  );
  const ans = useMemo(
    () => MoodBlockComposer({ thisMonth, datas }),
    [datas, thisMonth]
  );

  const arr = useMemo(() => {
    // console.log("重新计算");
    const arr: (CircleBlockProp | undefined)[][] = [];

    for (const ele of ans) {
      if (ele.date.getDate() === 1) {
        const temp: (CircleBlockProp | undefined)[] = [];
        for (let j = (ele.date.getDay() + 6) % 7; j > 0; j--) {
          temp.push(undefined);
        }
        temp.push(ele);
        arr.push(temp);
        continue;
      }

      if (ele.date.getDay() === 1) {
        arr.push([]);
      }

      arr[arr.length - 1].push(ele);
    }
    for (let i = 7 - arr[arr.length - 1].length; i > 0; i--) {
      arr[arr.length - 1].push(undefined);
    }
    return arr;
  }, [ans]);
  console.log(arr);

  return (
    <View style={CustomeBlockStyle.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* @ts-ignore */}
        <AntIcon name="caretleft" size={24} color={unChoseColor} />
        <Text style={{ fontSize: 20 }}>
          {date.getFullYear() + "年" + (date.getMonth() + 1) + "月"}
        </Text>
        {/* @ts-ignore */}
        <AntIcon name="caretright" size={24} color={unChoseColor} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", height: 46 }}>
        <Text style={CustomeBlockStyle.dayText}>周一</Text>
        <Text style={CustomeBlockStyle.dayText}>周二</Text>
        <Text style={CustomeBlockStyle.dayText}>周三</Text>
        <Text style={CustomeBlockStyle.dayText}>周四</Text>
        <Text style={CustomeBlockStyle.dayText}>周五</Text>
        <Text style={CustomeBlockStyle.dayText}>周六</Text>
        <Text style={CustomeBlockStyle.dayText}>周日</Text>
      </View>
      <View style={{ gap: 5 }}>
        {arr.map((row, k) => (
          <View key={k} style={{ flexDirection: "row", gap: 3 }}>
            {row.map((v, k) => (
              <View style={CustomeBlockStyle.emptyblock} key={k}>
                {v && <CircleBlock {...v} />}
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
function CircleBlock({ series, width, text, textStyle }: CircleBlockProp) {
  return (
    <View>
      <PieChart widthAndHeight={width} series={series} cover={0.7} />
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

function MoodBlockComposer({
  thisMonth,
  datas,
}: {
  thisMonth: Date[];
  datas: addDataType[];
}) {
  const ans: (CircleBlockProp & { date: Date })[] = thisMonth.map((v) => {
    const series: Slice[] = MoodArr.map((ele) => ({
      value: 0,
      color: ele.color as string,
    }));
    return { text: v.getDate(), series, width: 35, date: v };
  });

  for (const ele of datas) {
    ans[ele.date % 100].series[ele.moodId].value++;
  }

  for (const ele of ans) {
    if (ele.series.reduce((prev, cur) => prev + cur.value, 0) === 0) {
      ele.series.push({ value: 1, color: "#D9D9D9" });
    }
  }

  return ans;
}

import { MoodArr } from "@/consts";
import { addDataType } from "@/sqls/indexSql";
import { SkiaChart } from "@wuba/react-native-echarts";
import { useEffect, useMemo, useRef } from "react";
import { View, Text, Image, ColorValue, StyleSheet } from "react-native";
import * as echarts from "echarts/core";

export default function MoodView({ datas }: { datas: addDataType[] }) {
  const MybarChartDatas = useMemo(() => MybarChartDataComposer(datas), [datas]);

  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ fontFamily: "AaTianNiuNai", fontSize: 18 }}>
          本月高频情绪
        </Text>
      </View>
      <View>
        <MypieChartGroup datas={MybarChartDatas} />
        <MybarChart datas={MybarChartDatas} />
      </View>
    </>
  );
}

type MybarChartRow = { value: number; itemStyle: { color: ColorValue } };

function MybarChartDataComposer(datas: addDataType[]): MybarChartRow[] {
  const values: MybarChartRow[] = MoodArr.map((v) => ({
    value: 0,
    itemStyle: {
      color: v.color,
    },
  }));
  for (const ele of datas) {
    values[ele.moodId].value++;
  }
  return values;
}

function MybarChart({ datas }: { datas: MybarChartRow[] }) {
  const skiaRef = useRef<any>(null);
  useEffect(() => {
    const option = {
      yAxis: {
        data: MoodArr.map((v, k) => ({
          value: " ",
          textStyle: {
            backgroundColor: MoodArr[k].color,
            width: 20,
            height: 20,
            borderRadius: 10,
          },
        })),
        axisTick: {
          length: 0,
        },
        type: "category",
        inverse: true,
      },
      xAxis: { splitLine: { lineStyle: { type: "dashed" } } },
      label: {
        show: true,
        color: "white",
        position: "insideLeft",
      },
      series: [
        {
          type: "bar",
          data: datas,
          itemStyle: {
            color: "#91cc75",
            shadowColor: "#91cc75",
            borderType: "dashed",
            opacity: 0.7,
            borderRadius: 15,
          },
        },
      ],
    };
    let chart: any;
    if (skiaRef.current) {
      chart = echarts.init(skiaRef.current, "light", {
        renderer: "skia" as any,
        width: 350,
        height: 300,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [datas]);

  return <SkiaChart ref={skiaRef} />;
}

type MypieChartProps = {
  total: number;
  has: number;
  moodId: number;
};
function MypieChart({ total, has, moodId }: MypieChartProps) {
  const WidthAndHeight = 70;
  const skiaRef = useRef<any>(null);
  useEffect(() => {
    const option = {
      series: [
        {
          type: "pie",
          data: [
            {
              value: has,
              itemStyle: { borderRadius: 15, color: MoodArr[moodId].color },
              label: { show: false },
            },
            {
              value: total - has,
              label: { show: false },
              itemStyle: {
                color: "transparent",
              },
            },
          ],
          radius: ["80%", "100%"],
        },
      ],
    };
    let chart: any;
    if (skiaRef.current) {
      chart = echarts.init(skiaRef.current, "light", {
        renderer: "skia" as any,
        width: WidthAndHeight,
        height: WidthAndHeight,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [has, moodId, total]);

  return (
    <View style={{ width: WidthAndHeight }}>
      <View>
        <SkiaChart ref={skiaRef} />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            },
          ]}
        >
          <Image
            source={MoodArr[moodId].statisticPic}
            style={{
              width: (WidthAndHeight * 4) / 7,
              height: (WidthAndHeight * 4) / 7,
            }}
          />
        </View>
      </View>
      <Text style={{ textAlign: "center" }}>
        {Math.round((has / total) * 100)}%
      </Text>
      <Text style={{ textAlign: "center" }}>{MoodArr[moodId].descirption}</Text>
    </View>
  );
}

function MypieChartGroup({ datas }: { datas: MybarChartRow[] }) {
  let total = datas.reduce((p, c) => p + c.value, 0);
  total = total || 1;
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      {datas.map((v, k) => (
        <MypieChart total={total} has={v.value} moodId={k} key={k} />
      ))}
    </View>
  );
}

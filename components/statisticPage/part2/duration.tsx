import { SkiaChart } from "@wuba/react-native-echarts";
import * as echarts from "echarts/core";
import { useRef, useEffect, useMemo } from "react";
import { View, Text } from "react-native";
import sportArr from "@/consts/sportType";
import { addDataType } from "@/sqls/indexSql";

export default function DurationView({
  datas,
  thisMonth,
  width,
}: {
  datas: addDataType[];
  thisMonth: Date[];
  width: number;
}) {
  return (
    <View style={{ paddingHorizontal: 16, alignItems: "center" }}>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ fontFamily: "AaTianNiuNai", fontSize: 18 }}>
          时间分布
        </Text>
      </View>
      <MybarChart datas={datas} thisMonth={thisMonth} width={width - 32} />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ fontFamily: "AaTianNiuNai", fontSize: 18 }}>
          总时间比例
        </Text>
      </View>
      <MypieChart datas={datas} thisMonth={thisMonth} width={width - 32} />
    </View>
  );
}

function MybarChart({
  datas,
  thisMonth,
  width,
}: {
  datas: addDataType[];
  thisMonth: Date[];
  width: number;
}) {
  const skiaRef = useRef<any>(null);
  const series = useMemo(() => {
    const series = sportArr.map((v) => ({
      data: thisMonth.map(() => 0),
      type: "bar",
      stack: "x",
      itemStyle: { color: v.color },
      name: v.sportName,
    }));
    for (const ele of datas) {
      series[ele.sportId].data[(ele.date % 100) - 1] +=
        (ele.timeend - ele.timestart) / 60000;
    }
    return series;
  }, [datas, thisMonth]);
  useEffect(() => {
    const option = {
      legend: {
        data: sportArr.map((v) => ({
          name: v.sportName,
          itemStyle: { color: v.color },
        })),
        icon: "circle",
        show: true,
        // left: "right",
        right: 0,
        top: "middle",
        orient: "vertical",
        // type: "scroll",
      },
      grid: {
        right: 70,
        bottom: 40,
      },
      xAxis: {
        type: "category",
        data: thisMonth.map((v, k) => k + 1),
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 1,
        },
      },
      yAxis: { name: "时间/分钟" },
      series,
    };
    let chart: any;
    if (skiaRef.current) {
      chart = echarts.init(skiaRef.current, "light", {
        renderer: "skia" as any,
        width: width,
        height: 300,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [datas, series, thisMonth, width]);

  return (
    <View
      style={{
        boxShadow: "0 4 4 rgba(0,0,0,0.1)",
        marginBottom: 20,
        borderRadius: 10,
      }}
    >
      <SkiaChart ref={skiaRef} />
    </View>
  );
}

function MypieChart({
  datas,
  thisMonth,
  width,
}: {
  datas: addDataType[];
  thisMonth: Date[];
  width: number;
}) {
  const skiaRef = useRef<any>(null);

  const [data, total] = useMemo(() => {
    const data = sportArr.map((v) => ({
      value: 0,
      name: v.sportName,
      itemStyle: { color: v.color },
    }));
    let total = 0;
    for (const ele of datas) {
      const minute = (ele.timeend - ele.timestart) / 60000;
      data[ele.sportId].value += minute;
      total += minute;
    }
    return [data.filter((v) => v.value !== 0), total];
  }, [datas]);

  useEffect(() => {
    const option = {
      title: {
        text: total + "分钟",
        left: "center",
        top: "center",
      },
      series: [
        {
          type: "pie",
          data: data,
          radius: ["30%", "60%"],
          silent: true,
        },
      ],
    };
    let chart: any;
    if (skiaRef.current) {
      chart = echarts.init(skiaRef.current, "light", {
        renderer: "skia" as any,
        width: width,
        height: 300,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [data, datas, thisMonth, total, width]);

  return (
    <View
      style={{
        boxShadow: "0 4 4 rgba(0,0,0,0.1)",
        marginBottom: 20,
        borderRadius: 10,
      }}
    >
      <SkiaChart ref={skiaRef} />
    </View>
  );
}

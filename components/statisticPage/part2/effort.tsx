import { requireRunningDog } from "@/components/addPage/addPage";
import { effortArr } from "@/consts";
import { addDataType } from "@/sqls/indexSql";
import { useEffect, useMemo, useRef } from "react";
import { View, Image, Text } from "react-native";
import { SkiaChart } from "@wuba/react-native-echarts";
import * as echarts from "echarts/core";
import { DogsayGroup } from "./dogsay";
import { effortSystemPrompt } from "@/consts/propmts";

export default function EffortView({
  datas,
  width,
}: {
  datas: addDataType[];
  width: number;
}) {
  const counts = useMemo(() => {
    const counts = effortArr.map(() => 0);
    for (const ele of datas) {
      counts[ele.effort]++;
    }
    return counts;
  }, [datas]);

  const reqStr = useMemo(() => {
    const reqArr = effortArr
      .map((v, k) => `${v.s1}:${counts[k]}`)
      .filter((v, k) => k !== 0);
    return JSON.stringify(reqArr);
  }, [counts]);
  console.log(reqStr);

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <Text style={{ fontFamily: "AaTianNiuNai", fontSize: 18 }}>
          本月耗力次数
        </Text>
      </View>
      <DogLine width={width - 32} counts={counts} />
      <MypieChart width={width - 32} counts={counts} />
      {/* <DogsayGroup reqStr={reqStr} SystemPrompt={effortSystemPrompt} /> */}
    </View>
  );
}

function DogLine({ width, counts }: { width: number; counts: number[] }) {
  const lefts = useMemo(
    () => [width / 4 - 5, width / 2 - 5, (width / 4) * 3 - 5, width - 12.5],
    [width]
  );

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          borderRadius: 7.5,
          overflow: "hidden",
          height: 15,
          marginTop: 30,
        }}
      >
        <View
          style={{
            width: width / 4,
            backgroundColor: effortArr[1].color,
            height: 15,
          }}
        ></View>
        <View
          style={{
            width: width / 4,
            backgroundColor: effortArr[2].color,
            height: 15,
          }}
        ></View>
        <View
          style={{
            width: width / 4,
            backgroundColor: effortArr[3].color,
            height: 15,
          }}
        ></View>
        <View
          style={{
            width: width / 4,
            backgroundColor: effortArr[4].color,
            height: 15,
          }}
        ></View>
        {lefts.map((v, k) => (
          <View
            style={{
              top: 0,
              bottom: 0,
              left: v,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
            }}
            key={k}
          >
            <View
              style={{
                height: 10,
                width: 10,
                borderRadius: 999,
                backgroundColor: "white",
              }}
            ></View>
          </View>
        ))}
      </View>
      <Image
        source={requireRunningDog}
        style={[
          { width: 64, height: 37, position: "absolute", left: -16, top: 16 },
        ]}
      />
      {lefts.map((v, k) => (
        <View style={{ position: "absolute", left: v - 13, width: 36 }} key={k}>
          <View
            style={{
              width: 36,
              height: 20,
              backgroundColor: "#FFB52B",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Text style={{ fontSize: 14, lineHeight: 20, textAlign: "center" }}>
              {counts[k + 1]}次
            </Text>
          </View>
          <View style={{ marginTop: 2 }}>
            <View
              style={{
                width: 5,
                height: 5,
                backgroundColor: "#FFB52B",
                alignSelf: "center",
                borderRadius: 999,
              }}
            ></View>
          </View>
        </View>
      ))}
      {lefts.map((v, k) => (
        <View
          style={{ width: 60, position: "absolute", left: v - 25, top: 48 }}
          key={k}
        >
          <Text style={{ textAlign: "center", fontSize: 10 }}>
            {effortArr[k + 1].s1}
          </Text>
        </View>
      ))}
    </View>
  );
}

function MypieChart({ width, counts }: { width: number; counts: number[] }) {
  const skiaRef = useRef<any>(null);

  useEffect(() => {
    const option = {
      legend: {
        icon: "circle",
        orient: "vertical",
        right: 0,
        top: "bottom",
      },
      series: [
        {
          type: "pie",
          data: counts
            .map((v, k) => ({
              value: v,
              itemStyle: { color: effortArr[k].color },
              name: effortArr[k].s1,
            }))
            .filter((v) => v.value !== 0),
          itemStyle: {
            opacity: 0.9,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: "white",
          },
          left: "left",
          center: ["40%", "50%"],
          label: {
            color: "black",
            fontSize: 16,
            formatter: (data: any) => data.value,
            position: "inside",
          },
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
  }, [counts, width]);

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

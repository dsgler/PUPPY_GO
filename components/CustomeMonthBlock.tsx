import { dayDescription } from "@/consts/dayDescription";
import { BrandColor, unChoseColor } from "@/consts/tabs";
import { getDatesInMonth } from "@/utility/datetool";
import { useMemo } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";

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
  },
});
export function CustomeMonthBlock({
  chosen,
  setChosen,
  date,
}: {
  chosen: number[];
  setChosen: (arr: number[]) => void;
  date: Date;
}) {
  const isDateChanged = date.getMonth();
  const thisMonth = useMemo(
    () => getDatesInMonth(date),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDateChanged]
  );

  const arr = useMemo(() => {
    // console.log("重新计算");
    const arr: (Date | undefined)[][] = [];

    for (const ele of thisMonth) {
      if (ele.getDate() === 1) {
        const temp: (Date | undefined)[] = [];
        for (let j = (ele.getDay() + 6) % 7; j > 0; j--) {
          temp.push(undefined);
        }
        temp.push(ele);
        arr.push(temp);
        continue;
      }

      if (ele.getDay() === 1) {
        arr.push([]);
      }

      arr[arr.length - 1].push(ele);
    }
    for (let i = 7 - arr[arr.length - 1].length; i > 0; i--) {
      arr[arr.length - 1].push(undefined);
    }
    return arr;
  }, [thisMonth]);

  const Block = ({ day }: { day: number | undefined }) => {
    if (day === undefined) {
      return <View style={CustomeBlockStyle.emptyblock}></View>;
    }

    const isChosen = chosen.includes(day);

    return (
      <Pressable
        style={[
          CustomeBlockStyle.block,
          isChosen ? CustomeBlockStyle.chosenBlock : null,
        ]}
        onPress={() => {
          if (isChosen) {
            setChosen(chosen.filter((v) => v !== day));
          } else {
            setChosen([...chosen, day]);
          }
        }}
      >
        <Text
          style={[
            CustomeBlockStyle.blockText,
            chosen.includes(day) ? CustomeBlockStyle.chosenBlockText : null,
            date.getDate() === day ? { color: BrandColor } : null,
          ]}
        >
          {day}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={{
        backgroundColor: "#FFFAF3",
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
    >
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
              <Block day={v?.getDate()} key={k} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
const dayChina = [1, 2, 3, 4, 5, 6, 0];
export function CustomeWeekBlock({
  chosen,
  setChosen,
}: {
  chosen: number[];
  setChosen: (arr: number[]) => void;
}) {
  const Block = ({ day }: { day: number }) => {
    const isChosen = chosen.includes(day);

    return (
      <Pressable
        style={[
          CustomeBlockStyle.block,
          isChosen ? CustomeBlockStyle.chosenBlock : null,
        ]}
        onPress={() => {
          if (isChosen) {
            setChosen(chosen.filter((v) => v !== day));
          } else {
            setChosen([...chosen, day]);
          }
        }}
      >
        <Text
          style={[
            CustomeBlockStyle.dayText,
            chosen.includes(day) ? CustomeBlockStyle.chosenBlockText : null,
            new Date().getDay() === day ? { color: BrandColor } : null,
          ]}
        >
          {dayDescription[day]}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={CustomeBlockStyle.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 46,
          gap: 3,
        }}
      >
        {dayChina.map((v) => (
          <Block day={v} key={v} />
        ))}
      </View>
    </View>
  );
}

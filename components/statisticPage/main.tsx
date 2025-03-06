import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "./Header";
import * as pageType_consts from "./pageType";
import { useEffect, useMemo, useState } from "react";
import { ChooseIcon } from "./ChooseIcon";
import { MonthSwitcher } from "./month";
import ChooseSport from "./ChooseSport";
import Part2View from "./part2/part2";
import { addDataType } from "@/sqls/indexSql";
import { useSQLiteContext } from "expo-sqlite";
import { getDateNumber, getDatesInMonth } from "@/utility/datetool";
import { getRows } from "./sql";

import * as echarts from "echarts/core";
import { PieChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import { SkiaRenderer } from "@wuba/react-native-echarts";
import { ChosenDateArrCtx } from "./public";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

echarts.use([
  SkiaRenderer,
  GridComponent,
  PieChart,
  BarChart,
  LegendComponent,
  TitleComponent,
]);

export default function Page() {
  const [pageType, setPageType] = useState(pageType_consts.MOOD);
  const [sportId, setSportId] = useState(-1);
  const db = useSQLiteContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const date = useMemo(() => d, [d.getDate()]);
  const [date, setDate] = useState(new Date());
  const isDateChanged = date.getMonth();
  const thisMonth = useMemo(
    () => getDatesInMonth(date),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDateChanged]
  );

  const [datas, setDatas] = useState<addDataType[]>([]);
  useEffect(() => {
    getRows(
      db,
      getDateNumber(thisMonth[0]),
      getDateNumber(thisMonth[thisMonth.length - 1]),
      sportId
    ).then((v) => {
      setDatas(v);
    });
  }, [db, sportId, thisMonth]);
  useEffect(() => {
    console.log("datas changed");
  }, [datas]);

  const [upperHeight, setUpperHeight] = useState(0);
  const chosenDateArr = useState(getDateNumber(date));

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ChosenDateArrCtx.Provider value={chosenDateArr}>
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            <View
              onLayout={(e) => {
                setUpperHeight(e.nativeEvent.layout.height);
              }}
            >
              <Header
                date={date}
                ShowDatePicker={() => {
                  if (Platform.OS === "android") {
                    DateTimePickerAndroid.open({
                      value: date,
                      mode: "date",
                      onChange: (e) => {
                        if (e.type === "set") {
                          setDate(new Date(e.nativeEvent.timestamp));
                        }
                      },
                    });
                  }
                }}
              />
              <View style={{ height: 10 }}></View>
              <ChooseIcon pageType={pageType} setPageType={setPageType} />
              <MonthSwitcher
                date={date}
                datas={datas}
                thisMonth={thisMonth}
                pageType={pageType}
              />
              <ChooseSport sportId={sportId} setSportId={setSportId} />
              <View style={{ height: 20 }}></View>
            </View>
            <Part2View
              upperHeight={upperHeight}
              datas={datas}
              pageType={pageType}
              thisMonth={thisMonth}
            />
          </View>
        </ChosenDateArrCtx.Provider>
      </SafeAreaView>
      {/* {isShowDatePicker && (
        <Portal>
        <Modal visible={isShowDatePicker}>
          <RNDateTimePicker
        </Modal>
        </Portal>
      )} */}
    </>
  );
}

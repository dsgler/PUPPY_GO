import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "./Header";
import * as pageType_consts from "./pageType";
import { useState } from "react";
import { ChooseIcon } from "./ChooseIcon";
import PieChart from "react-native-pie-chart";
import { CustomeMonthBlock } from "./month";

export default function Page() {
  const [pageType, setPageType] = useState(pageType_consts.MOOD);
  // const widthAndHeight = 250;

  // const series = [
  //   { value: 430, color: "#fbd203" },
  //   { value: 321, color: "#ffb300" },
  //   { value: 185, color: "#ff9100" },
  //   { value: 0, color: "#ff6c00" },
  // ];

  return (
    <View
      style={{ flex: 1, paddingHorizontal: 16, backgroundColor: "#EFAC5B" }}
    >
      <SafeAreaView>
        <Header />
        <ChooseIcon pageType={pageType} setPageType={setPageType} />
        {/* <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          cover={0.45}
        /> */}
        <CustomeMonthBlock date={new Date()} />
      </SafeAreaView>
    </View>
  );
}

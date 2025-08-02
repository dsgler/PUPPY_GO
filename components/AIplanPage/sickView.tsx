import { View, Text, TextInput } from "react-native";
import { InfoObjStateCtx } from "./public";
import { ViewStyle } from './ViewStyle';
import { ChooseRow } from './ChooseRow';
import { sickArr } from "@/consts/AIplanPage";
import { useContext } from "react";
import { BrandColor } from "@/consts/tabs";

export default function SickView() {
  const [InfoObj, updateInfoObj] = useContext(InfoObjStateCtx);

  return (
    <View>
      <Text style={ViewStyle.mainText}>伤病</Text>
      <Text style={ViewStyle.subText}>
        选择伤病后，将为您去除不适合的动作及机械类动作
      </Text>
      <View style={{ height: 20 }}></View>
      {sickArr.map((v) => (
        <ChooseRow
          isChosen={InfoObj.sick.chosen.has(v.id)}
          toggleIsChosen={() => {
            updateInfoObj((InfoObj) => {
              InfoObj.sick.chosen.has(v.id)
                ? InfoObj.sick.chosen.delete(v.id)
                : InfoObj.sick.chosen.add(v.id);
            });
          }}
          key={v.id}
        >
          <View>
            <Text style={ViewStyle.Text}>{v.s1}</Text>
            <Text style={ViewStyle.subText}>{v.s2}</Text>
          </View>
        </ChooseRow>
      ))}
      <View style={ViewStyle.row}>
        <TextInput
          cursorColor={BrandColor}
          value={InfoObj.sick.attach}
          onChangeText={(text) => {
            updateInfoObj((InfoObj) => {
              InfoObj.sick.attach = text;
            });
          }}
          placeholder="其他伤病"
          style={[ViewStyle.Input]}
        />
      </View>
      <Text style={[ViewStyle.subText, { marginTop: 10, textAlign: "center" }]}>
        若无伤病可直接前往下一步
      </Text>
    </View>
  );
}

import { View, Text, TextInput } from "react-native";
import { InfoObjStateCtx, ViewStyle } from "./AIplanPage";
import { sickArr } from "@/consts/AIplanPage";
import { useContext } from "react";
import { BrandColor } from "@/consts/tabs";
import { ChooseRow } from "./sickView";

export default function BodyImproveView() {
  const [InfoObj, updateInfoObj] = useContext(InfoObjStateCtx);

  return (
    <View>
      <Text style={ViewStyle.mainText}>重点想改善哪一个部位</Text>
      <Text style={ViewStyle.subText}>将根据您的偏好为您生成合适的目标</Text>
      <View style={{ height: 20 }}></View>
      {sickArr.map((v) => (
        <ChooseRow
          isChosen={InfoObj.bodyImprove.chosen.has(v.id)}
          toggleIsChosen={() => {
            updateInfoObj((InfoObj) => {
              InfoObj.bodyImprove.chosen.has(v.id)
                ? InfoObj.bodyImprove.chosen.delete(v.id)
                : InfoObj.bodyImprove.chosen.add(v.id);
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
          placeholder="其他需求"
          style={[ViewStyle.Input]}
        />
      </View>
    </View>
  );
}

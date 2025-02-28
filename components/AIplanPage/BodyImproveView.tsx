import { View, Text, TextInput } from "react-native";
import { InfoObjStateCtx, ViewStyle } from "./public";
import { BodyImproveArr } from "@/consts/AIplanPage";
import { useContext } from "react";
import { BrandColor } from "@/consts/tabs";
import { ChooseRow } from "./public";

export default function BodyImproveView() {
  const [InfoObj, updateInfoObj] = useContext(InfoObjStateCtx);

  return (
    <View>
      <Text style={ViewStyle.mainText}>重点想改善哪一个部位</Text>
      <Text style={ViewStyle.subText}>将根据您的偏好为您生成合适的目标</Text>
      <View style={{ height: 20 }}></View>
      {BodyImproveArr.map((v) => (
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
          <Text style={[ViewStyle.Text, { marginVertical: 8 }]}>
            {v.description}
          </Text>
        </ChooseRow>
      ))}
      <View style={ViewStyle.row}>
        <TextInput
          cursorColor={BrandColor}
          value={InfoObj.bodyImprove.attach}
          onChangeText={(text) => {
            updateInfoObj((InfoObj) => {
              InfoObj.bodyImprove.attach = text;
            });
          }}
          placeholder="其他需求"
          style={[ViewStyle.Input]}
        />
      </View>
    </View>
  );
}

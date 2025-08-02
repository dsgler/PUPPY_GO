import { BrandColor } from '@/consts/tabs';
import { useContext } from 'react';
import { View, Text, TextInput } from 'react-native';
import { InfoObjStateCtx } from './public';
import { ViewStyle } from './ViewStyle';

export function HeightAndWeightView() {
  const [InfoObj, updateInfoObj] = useContext(InfoObjStateCtx);

  return (
    <View>
      <Text style={ViewStyle.mainText}>填写身高及体重</Text>
      <Text style={ViewStyle.subText}>填写真实信息，生成合适的计划</Text>
      <View style={{ height: 20 }}></View>
      <View style={ViewStyle.row}>
        <Text style={ViewStyle.preInputText}>身高(cm)</Text>
        <TextInput
          value={InfoObj.heightRaw}
          onChangeText={(text) => {
            updateInfoObj((obj) => {
              obj.heightRaw = text;
            });
          }}
          style={ViewStyle.Input}
          cursorColor={BrandColor}
          placeholder="请填写数字"
          keyboardType="numeric"
        />
      </View>
      <View style={ViewStyle.row}>
        <Text style={ViewStyle.preInputText}>体重(kg)</Text>
        <TextInput
          value={InfoObj.weightRaw}
          onChangeText={(text) => {
            updateInfoObj((obj) => {
              obj.weightRaw = text;
            });
          }}
          style={ViewStyle.Input}
          cursorColor={BrandColor}
          placeholder="请填写数字"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}

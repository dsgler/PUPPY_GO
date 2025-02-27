import { MyAlertCtx } from "@/app/_layout";
import { BrandColor } from "@/consts/tabs";
import { useContext } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { checkValid, InfoObjStateCtx } from "./AIplanPage";

const FooterStyle = StyleSheet.create({
  block: {
    borderRadius: 10,
    backgroundColor: BrandColor,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  Text: { color: "white", fontSize: 16 },
});
export function Footer({
  StepState: [Step, setStep],
}: {
  StepState: [number, React.Dispatch<React.SetStateAction<number>>];
}) {
  const isStart = Step <= 0;
  const isEnd = Step >= 2;
  const myAlert = useContext(MyAlertCtx);
  const [InfoObj] = useContext(InfoObjStateCtx);

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Pressable
        style={[FooterStyle.block, { opacity: isStart ? 0 : 1 }]}
        onPress={() => {
          setStep((x) => x - 1);
        }}
        disabled={isStart}
      >
        <Text style={FooterStyle.Text}>上一步</Text>
      </Pressable>
      <Pressable
        style={[FooterStyle.block]}
        onPress={() => {
          const ret = checkValid(Step, InfoObj);
          if (ret !== "") {
            myAlert(ret);
            return;
          }
          setStep((x) => x + 1);
        }}
      >
        <Text style={FooterStyle.Text}>{Step === 2 ? "完成" : "下一步"}</Text>
      </Pressable>
    </View>
  );
}

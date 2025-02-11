import { StyleSheet, View, Pressable, Text } from "react-native";
import { pageTypeArr } from "./pageType";

const ChooseIconStyle = StyleSheet.create({
  block: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 28,
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 13,
  },
  text: {
    fontSize: 15,
  },
});
export function ChooseIcon({
  pageType,
  setPageType,
}: {
  pageType: number;
  setPageType: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {pageTypeArr.map((v) => (
        <Pressable
          style={[
            ChooseIconStyle.block,
            {
              borderColor: v.color,
              backgroundColor: pageType === v.Id ? v.color : undefined,
            },
          ]}
          onPress={() => {
            setPageType(v.Id);
          }}
          key={v.Id}
        >
          <Text style={ChooseIconStyle.text}>{v.description}</Text>
        </Pressable>
      ))}
    </View>
  );
}

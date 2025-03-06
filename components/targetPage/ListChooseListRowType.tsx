import { BrandColor } from "@/consts/tabs";
import { View, Pressable, Text } from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";

export type ListChooseListRowType = { name: string; Id: number };
export function ListChoose({
  list,
  chosenId,
  setId,
}: {
  list: ListChooseListRowType[];
  chosenId: number;
  setId: (newId: number) => void;
}) {
  return (
    <View>
      {list.map((v) => {
        return (
          <Pressable
            onPress={() => {
              setId(v.Id);
            }}
            style={{ marginVertical: 5 }}
            key={v.Id}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                paddingVertical: 10,
                paddingLeft: 16,
                paddingRight: 16,
                flexDirection: "row",
                height: 45,
              }}
            >
              <Text style={{ fontSize: 16, flex: 1 }}>{v.name}</Text>
              {chosenId === v.Id ? (
                // @ts-ignore
                <AntIcon name="checkcircle" size={21} color={BrandColor} />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

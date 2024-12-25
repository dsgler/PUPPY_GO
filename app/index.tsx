import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href={"./addPage"}>Goto</Link>
      <View
        style={{
          borderWidth: 3,
          borderStyle: "dashed",
          width: 200,
          height: 20,
          borderColor: "green",
        }}
      ></View>
    </View>
  );
}

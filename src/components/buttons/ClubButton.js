import { Text, TouchableOpacity, View } from "react-native";

function ClubButton({ club, navigation }) {
  return (
    <TouchableOpacity
      className="box-border p-5 mb-2 bg-white rounded-lg"
      onPress={() => {
        navigation.navigate("Club", {
          guid: club.guid,
        });
      }}
    >
      <View className="flex flex-row items-center justify-between ">
        <View className="justify-center flex-1 w-auto space-y-3">
          <Text className="font-bold text-gray-700">{club.naam}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export { ClubButton };

import { Text, TouchableOpacity, View } from "react-native";

function TeamButton({ team, navigation }) {
  return (
    <TouchableOpacity
      className="box-border p-5 mb-2 bg-white rounded-lg"
      onPress={() => {
        navigation.navigate("Team", {
          guid: team.guid,
        });
      }}
    >
      <View className="flex flex-row items-center justify-between ">
        <View className="justify-center flex-1 w-auto space-y-3">
          <Text className="font-bold text-gray-700">{team.naam}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export { TeamButton };

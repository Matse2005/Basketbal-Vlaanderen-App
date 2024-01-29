import { Text, View, ActivityIndicator, Image, Linking } from "react-native";

function NoDataComponent() {
  return (
    <View className="items-center py-5 space-y-3 bg-white rounded-lg ">
      <Image
        PlaceholderContent={<ActivityIndicator />}
        cachePolicy="memory"
        source={require("../../assets/images/no_data.png")}
        resizeMode="contain"
        className="h-32 "
      />
      <Text className="text-center text-gray-500">
        Geen data gevonden om weer te geven
      </Text>
      <Text className="px-6 text-center text-gray-500">
        Is dit een fout? Herlaad het scherm door vanboven naar beneden te swipen
        of stuur een mailtje naar{" "}
        <Text
          className="text-orange-400 underline"
          onPress={() => Linking.openURL("mailto:matse@vanhorebeek.be")}
        >
          matse@vanhorebeek.be
        </Text>
      </Text>
    </View>
  );
}

export { NoDataComponent };

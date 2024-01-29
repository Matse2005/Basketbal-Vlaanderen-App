import { Text, View, ActivityIndicator, Image } from "react-native";

function NoFavoriteComponent() {
  return (
    <View className="items-center py-5 space-y-3 rounded">
      <Image
        PlaceholderContent={<ActivityIndicator />}
        cachePolicy="memory"
        source={require("../../assets/images/favorite.png")}
        resizeMode="contain"
        className="h-32 "
      />
      <Text className="text-center text-gray-500">
        Je hebt nog geen favoriete toegevoegd, zoek een club, team of competitie
        en voeg deze toe aan je favoriete.
      </Text>
    </View>
  );
}

export { NoFavoriteComponent };

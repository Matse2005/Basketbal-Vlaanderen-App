// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Linking,
  Platform,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import { getFavorites } from "../../logic/Favorites";
import { NoDataComponent } from "../../components/NoData";
import { PouleButton } from "../../components/buttons/PouleButton";
import { NoFavoriteComponent } from "../../components/NoFavorite";

function FavoritesPouleScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [poules, setPoules] = useState([]);
  var favorites = null;

  const getPoules = async () => {
    var items = [];
    favorites == null ? (favorites = await getFavorites()) : [];

    try {
      for (const favorite of favorites) {
        if (favorite.split("_")[0] == "poule") {
          const response = await fetch(
            "https://vblCB.wisseq.eu/VBLCB_WebService/data/pouleByGuid?pouleguid=" +
              favorite.split("_")[1]
          );
          const json = await response.json();
          items.push(...json);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    setPoules(items);
  };

  useEffect(() => {
    getPoules();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPoules();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className="h-full px-3">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          className="h-auto mt-2"
          data={poules}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyExtractor={({ guid }) => guid}
          ListEmptyComponent={<NoFavoriteComponent />}
          disableVirtualization={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <PouleButton poule={item} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
}

export default FavoritesPouleScreen;

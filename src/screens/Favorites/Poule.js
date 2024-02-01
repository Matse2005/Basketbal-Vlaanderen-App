// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  RefreshControl,
} from "react-native";
import { getFavorites } from "../../logic/Favorites";
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

  const checkForUpdates = async () => {
    if (favorites !== (await getFavorites())) {
      favorites = await getFavorites();
      getPoules();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getPoules();

      setInterval(() => {
        checkForUpdates();
      }, 30000);
    }, 200);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    checkForUpdates();
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
          extraData={poules}
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

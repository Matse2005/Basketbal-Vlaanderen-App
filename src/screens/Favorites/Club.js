// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  RefreshControl,
} from "react-native";
import { getFavorites } from "../../logic/Favorites";
import { ClubButton } from "../../components/buttons/ClubButton";
import { NoFavoriteComponent } from "../../components/NoFavorite";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

function FavoritesClubScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [clubs, setClubs] = useState([]);
  var favorites = null;

  const getClubs = async () => {
    var items = [];
    favorites == null ? (favorites = await getFavorites()) : [];

    try {
      for (const favorite of favorites) {
        if (favorite.split("_")[0] == "club") {
          const response = await fetch(
            "https://vblCB.wisseq.eu/VBLCB_WebService/data/OrgDetailByGuid?issguid=" +
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

    setClubs(items);
  };

  const checkForUpdates = async () => {
    if (favorites !== (await getFavorites())) {
      favorites = await getFavorites();
      getClubs();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getClubs();

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
          data={clubs}
          extraData={clubs}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyExtractor={({ guid }) => guid}
          ListEmptyComponent={<NoFavoriteComponent />}
          disableVirtualization={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <ClubButton club={item} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
}

export default FavoritesClubScreen;

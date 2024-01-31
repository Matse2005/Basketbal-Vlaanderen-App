// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  RefreshControl,
} from "react-native";
import { getFavorites } from "../../logic/Favorites";
import { TeamButton } from "../../components/buttons/TeamButton";
import { useCallback } from "react";
import { NoFavoriteComponent } from "../../components/NoFavorite";

function FavoritesTeamScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());
  const [teams, setTeams] = useState([]);
  var favorites = null;

  const getTeams = async () => {
    setRefresh(Date.now());
    var items = [];
    favorites == null ? (favorites = await getFavorites()) : [];
    try {
      for (const favorite of favorites) {
        if (favorite.split("_")[0] == "team") {
          const response = await fetch(
            "https://vblCB.wisseq.eu/VBLCB_WebService/data/TeamDetailByGuid?teamGuid=" +
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

    setTeams(items);
  };

  const checkForUpdates = async () => {
    if (favorites !== (await getFavorites())) {
      favorites = await getFavorites();
      getTeams();
    }
  };

  useEffect(() => {
    getTeams();

    setInterval(() => {
      checkForUpdates();
    }, 30000);
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
          data={teams}
          extraData={teams}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.guid}
          ListEmptyComponent={<NoFavoriteComponent />}
          disableVirtualization={true}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TeamButton team={item} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
}

export default FavoritesTeamScreen;

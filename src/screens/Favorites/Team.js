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

    console.log(refresh);
    setTeams(items);
  };

  useEffect(() => {
    getTeams();
  }, []);

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   getTeams();
  //   setTimeout(() => {
  //     setRefreshing(false);
  //   }, 2000);
  // }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTeams();
    console.log(teams);
    setRefreshing(false);
  }, []);

  return (
    <View className="h-full px-3">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          className="h-auto mt-2"
          extraData={refresh}
          data={teams}
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

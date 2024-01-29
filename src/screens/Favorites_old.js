// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  FlatList,
} from "react-native";
import { getFavorites } from "../logic/Favorites";
import { NoFavoriteComponent } from "../components/NoFavorite";
import { NoDataComponent } from "../components/NoData";

import { TeamButton } from "../components/buttons/TeamButton";
import { ClubButton } from "../components/buttons/ClubButton";
import { PouleButton } from "../components/buttons/PouleButton";
import { useFocusEffect } from "@react-navigation/native";

function FavoritesScreen({ navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [teams, setTeams] = useState([]);
  const [poules, setPoules] = useState([]);
  var favorites = null;

  const getTeams = async () => {
    var items = [];
    favorites == null ? (favorites = await getFavorites()) : null;

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

    setTeams(items);
  };

  const getClubs = async () => {
    var items = [];
    favorites == null ? (favorites = await getFavorites()) : null;

    for (const favorite of favorites) {
      if (favorite.split("_")[0] == "club") {
        try {
          const response = await fetch(
            "https://vblCB.wisseq.eu/VBLCB_WebService/data/OrgDetailByGuid?issguid=" +
              favorite.split("_")[1]
          );
          const json = await response.json();
          items.push(...json);
        } catch (error) {
          console.error(error);
        }
      }
    }

    // setClubs(items);
    setClubs(items);
  };

  const getPoules = async () => {
    var items = [];
    favorites == null ? (favorites = await getFavorites()) : null;

    // console.log(favorites);

    for (const favorite of favorites) {
      if (favorite.split("_")[0] == "poule") {
        try {
          const response = await fetch(
            "https://vblCB.wisseq.eu/VBLCB_WebService/data/pouleByGuid?pouleguid=" +
              favorite.split("_")[1]
          );
          const json = await response.json();
          items.push(...json);
        } catch (error) {
          console.error(error);
        }
      }
    }

    setPoules(items);
  };

  const getData = async () => {
    try {
      await getClubs();
      await getTeams();
      await getPoules();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getData();
  //   }, [true])
  // );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [true]);

  return (
    <SafeAreaView className="h-full ">
      {isLoading || refreshing ? (
        <ActivityIndicator />
      ) : teams.length > 0 || clubs.length > 0 || poules.length > 0 ? (
        <View className="h-full px-3 py-2 mb-3">
          <Text className="my-2 text-lg font-bold">Clubs</Text>
          <FlatList
            className="h-auto mt-2"
            data={clubs}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            keyExtractor={({ guid }) => guid}
            ListEmptyComponent={<NoDataComponent />}
            disableVirtualization={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <View>
                {/* {console.log(item)} */}
                <ClubButton club={item} navigation={navigation} />
              </View>
            )}
          />
          <Text className="my-2 text-lg font-bold">Teams</Text>
          <FlatList
            className="h-auto mt-2"
            data={teams}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            keyExtractor={({ guid }) => guid}
            ListEmptyComponent={<NoDataComponent />}
            disableVirtualization={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <TeamButton team={item} navigation={navigation} />
            )}
          />
          <Text className="my-2 text-lg font-bold">Competities</Text>
          <FlatList
            className="h-auto mt-2"
            data={poules}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            keyExtractor={({ guid }) => guid}
            ListEmptyComponent={<NoDataComponent />}
            disableVirtualization={true}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <PouleButton poule={item} navigation={navigation} />
            )}
          />
        </View>
      ) : (
        <View className="flex items-center justify-center h-full px-3">
          <NoFavoriteComponent />
        </View>
      )}
    </SafeAreaView>
  );
}

export default FavoritesScreen;

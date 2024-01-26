// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

function FavoritesScreen({ navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [teams, setTeams] = useState([]);

  const favorites = [
    "club_BVBL1255",
    "team_BVBL1171J21%20%201",
    "team_BVBL1171HSE%20%202",
    "team_BVBL1171DSE%20%201",
    "team_BVBL1171HSE%20%201",
    "team_BVBL1171J18%20%201",
  ];

  // const storeData = async (value) => {
  //   try {
  //     const jsonValue = JSON.stringify(value);
  //     await AsyncStorage.setItem("favorites", jsonValue);
  //   } catch (e) {
  //     // saving error
  //   }
  // };

  // const getData = async () => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem("favorites");
  //     return jsonValue != null ? JSON.parse(jsonValue) : null;
  //   } catch (e) {
  //     // error reading value
  //   }
  // };

  // storeData(favorites);

  const getTeams = async () => {
    var items = [];

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
        } finally {
          setLoading(false);
        }
      }
    }

    setClubs(items);
  };

  useEffect(() => {
    try {
      getClubs();
      getTeams();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="w-full h-full">
      <ScrollView className="w-full h-full px-3 py-2 mb-3">
        <Text className="my-2 text-lg font-bold">Teams</Text>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          teams.map((team, index) => {
            return (
              <View className="mb-2" key={index}>
                <TouchableOpacity
                  className="box-border w-full p-5 bg-white rounded-lg "
                  onPress={() => {
                    navigation.navigate("Team", {
                      guid: team.guid,
                    });
                  }}
                >
                  <View className="flex flex-row items-center justify-between w-full">
                    <View className="justify-center flex-1 w-auto space-y-3">
                      <Text className="font-bold text-gray-700">
                        {team.naam}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}
        <Text className="my-2 text-lg font-bold">Clubs</Text>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          clubs.map((club, index) => {
            return (
              <View className="mb-2" key={index}>
                <TouchableOpacity
                  className="box-border w-full p-5 bg-white rounded-lg "
                  onPress={() => {
                    navigation.navigate("Club", {
                      guid: club.guid,
                    });
                  }}
                >
                  <View className="flex flex-row items-center justify-between w-full">
                    <View className="justify-center flex-1 w-auto space-y-3">
                      <Text className="font-bold text-gray-700">
                        {club.naam}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default FavoritesScreen;

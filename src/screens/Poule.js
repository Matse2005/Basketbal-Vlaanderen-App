import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Platform,
  RefreshControl,
} from "react-native";
import { Icon } from "react-native-elements";
import { checkFavorite, toggleFavorite } from "../logic/Favorites";

function PouleScreen({ route, navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { guid } = route.params;

  const getPoule = async () => {
    try {
      const response = await fetch(
        "https://vblCB.wisseq.eu/VBLCB_WebService/data/pouleByGuid?pouleguid=" +
          guid
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const setIcon = async () => {
    var favorite = null;

    await checkFavorite(guid, "poule").then(function (favoriteState) {
      favorite = favoriteState;
    });

    navigation.setOptions({
      headerRight: () => (
        <Icon
          name={favorite ? "heart" : "heart-outline"}
          type="ionicon"
          onPress={() => {
            toggleFavorite(guid, "poule").then(() => {
              setIcon();
            });
          }}
          color="#fb923c"
        />
      ),
    });
  };

  useEffect(() => {
    setIcon();
    getPoule();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPoule();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className="px-3">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.guid}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          disableVirtualization={true}
          className="h-full mt-2 "
          renderItem={({ item }) => (
            <View className="mt-2 space-y-4 ">
              <View className="flex flex-row items-center justify-between px-3 py-2 text-center bg-white rounded">
                <View className="flex items-center justify-center h-8 text-center">
                  <Text className="font-bold text-gray-500">{item.naam}</Text>
                </View>
              </View>
              <View className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded">
                <View className="flex flex-row items-center w-2/3 space-x-2">
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="font-bold text-gray-500">Nr</Text>
                  </View>
                  <Text className="text-gray-500">Naam</Text>
                </View>
                <View className="flex flex-row items-center justify-end w-1/3 space-x-2">
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="text-gray-500">#</Text>
                  </View>
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="text-gray-500">Pt</Text>
                  </View>
                </View>
              </View>
              <View className="mb-6 space-y-2">
                {item.teams.map((team) => {
                  return (
                    <View
                      key={team.guid}
                      className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                    >
                      <View className="flex flex-row items-center w-2/3 space-x-2 break-words">
                        <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                          <Text className="items-center justify-center text-lg font-bold text-center text-gray-500">
                            {team.rangNr.replaceAll(" ", "")}
                          </Text>
                        </View>
                        <Text className="text-gray-500 break-words">
                          {team.naam}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center justify-end w-1/3 space-x-2">
                        <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                          <Text className="text-gray-500">{team.wedAant}</Text>
                        </View>
                        <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                          <Text className="text-gray-500">{team.wedPunt}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        ></FlatList>
      )}
      {/* <Text>{item.doc.guid}</Text> */}
    </View>
  );
}

export default PouleScreen;

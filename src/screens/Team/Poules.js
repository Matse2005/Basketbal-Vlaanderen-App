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
  ScrollView,
  Button,
  Linking,
  Platform,
  Pressable,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import GameComponent from "../../components/GameComponent";
import { NoDataComponent } from "../../components/NoData";

function TeamPoulesScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);
  const { guid } = route.params;

  const getClub = async () => {
    try {
      const response = await fetch(
        "https://vblCB.wisseq.eu/VBLCB_WebService/data/TeamDetailByGuid?teamGuid=" +
          guid.replaceAll(" ", "%20")
      );
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClub();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getClub();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className="h-full px-3 ">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {data.map((team) => {
            return (
              <View key={team.guid} className="h-full mt-2">
                <View className="h-full space-y-4">
                  <View className="items-center px-5 py-4 space-y-4 text-center bg-white rounded">
                    <Text className="text-lg font-bold text-center text-gray-700">
                      {team.naam}
                    </Text>
                  </View>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    className="space-y-2"
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                  >
                    <Text className="text-lg font-bold">Competities</Text>
                    <View className="mt-2 mb-6">
                      {team.poules && team.poules.length > 0 ? (
                        team.poules.map((poule) => (
                          <TouchableOpacity
                            key={poule.guid}
                            onPress={() => {
                              navigation.navigate("Poule", {
                                guid: poule.guid,
                              });
                            }}
                            className="flex flex-row items-center justify-between px-3 py-2 mb-2 bg-white rounded"
                          >
                            <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                              <Text className="items-center justify-center text-lg font-bold text-center text-gray-500">
                                {poule.naam.toLowerCase().includes("beker") ? (
                                  <Icon
                                    name="trophy"
                                    type="ionicon"
                                    className={
                                      Platform.OS == "ios" ? "mt-1.5" : "mt-0"
                                    }
                                    color="#6b7280"
                                    solid={true}
                                    size={19}
                                  />
                                ) : (
                                  <Icon
                                    name="basketball"
                                    type="ionicon"
                                    className={
                                      Platform.OS == "ios" ? "mt-1.5" : "mt-0"
                                    }
                                    color="#6b7280"
                                    solid={true}
                                    size={19}
                                  />
                                )}
                              </Text>
                            </View>
                            <Text className="flex-wrap w-4/5 text-right text-gray-500">
                              {poule.naam}
                            </Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View className="flex items-center justify-center rounded-lg">
                          <NoDataComponent />
                        </View>
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default TeamPoulesScreen;

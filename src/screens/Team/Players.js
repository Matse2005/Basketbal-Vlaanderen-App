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
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className="w-full h-full px-3">
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
                    <Text className="text-lg font-bold">Spelers</Text>
                    <View className="mt-2 mb-4">
                      {team.spelers.map((speler) => (
                        <View
                          key={speler.lidNr}
                          // onPress={() => {
                          //   navigation.navigate("Poule", {
                          //     guid: poule.guid,
                          //   });
                          // }}
                          className="flex flex-row items-center justify-between px-3 py-2 mb-2 bg-white rounded"
                        >
                          <Text className="flex-wrap w-3/5 text-left text-gray-500">
                            {speler.naam}
                          </Text>
                          <View className="items-center justify-center h-8 px-3 bg-gray-100 rounded">
                            <Text className="items-center justify-center font-bold text-center text-gray-500">
                              {speler.sGebDat}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    <Text className="text-lg font-bold">
                      Technische Vergunningen
                    </Text>
                    <View className="mt-2 mb-4">
                      {team.tvlijst.map((tv) => (
                        <View
                          key={tv.lidNr}
                          // onPress={() => {
                          //   navigation.navigate("Poule", {
                          //     guid: poule.guid,
                          //   });
                          // }}
                          className="flex flex-row items-center justify-between px-3 py-2 mb-2 bg-white rounded"
                        >
                          <Text className="flex-wrap w-3/5 text-left text-gray-500">
                            {tv.naam}
                          </Text>
                          <View className="items-center justify-center h-8 px-3 bg-gray-100 rounded">
                            <Text className="items-center justify-center font-bold text-center text-gray-500">
                              {tv.tvCaC}
                            </Text>
                          </View>
                        </View>
                      ))}
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

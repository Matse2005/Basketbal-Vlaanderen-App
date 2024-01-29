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

function ClubTeamsScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);
  const { guid } = route.params;
  // const guid = "BVBL1171";

  const getClub = async () => {
    try {
      const response = await fetch(
        "https://vblCB.wisseq.eu/VBLCB_WebService/data/OrgDetailByGuid?issguid=" +
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
    // <Text>Hello World 2</Text>
    <View className="w-full h-full px-3">
      {/* <View className="flex flex-row w-auto p-2 mx-3 mt-2 bg-white rounded-lg">
        <TouchableOpacity
          className="items-center justify-center w-1/2 px-3 py-2 text-center rounded"
          onPress={() => {
            navigation.navigate("ClubInfo", {
              guid: guid,
            });
          }}
        >
          <Text className="text-base font-bold text-gray-700">Info</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center justify-center w-1/2 px-3 py-2 text-center bg-orange-400 rounded">
          <Text className="text-base font-bold text-white">Teams</Text>
        </TouchableOpacity>
      </View> */}
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          className="h-full mt-2"
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={({ guid }) => guid}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          disableVirtualization
          renderItem={({ item }) => (
            <View className="h-full space-y-4">
              <View className="px-5 py-4 bg-white rounded-lg">
                <View className="flex items-center flex-1 gap-1 text-center">
                  <Image
                    PlaceholderContent={<ActivityIndicator />}
                    placeholderStyle={{ backgroundColor: "#fff" }}
                    cachePolicy="memory"
                    source={{
                      uri:
                        "https://vbl.wisseq.eu/vbldataOrganisation/BVBL" +
                        item.guid.match(/\d+/g)[0] +
                        ".jpg",
                    }}
                    resizeMode="contain"
                    className="w-28 h-28"
                  />
                  <Text className="text-lg font-bold text-center text-gray-700">
                    {item.naam}
                  </Text>
                  <Text className="text-center text-gray-500">
                    Stamnummer {item.stamNr}
                  </Text>
                </View>
              </View>
              <View className="mb-6 space-y-2 ">
                <Text className="text-lg font-bold">Teams</Text>
                {item.teams.map((team, index) => {
                  return (
                    <View className="" key={team.guid}>
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
                })}
              </View>
            </View>
          )}
        ></FlatList>
      )}
    </View>
  );
}

export default ClubTeamsScreen;

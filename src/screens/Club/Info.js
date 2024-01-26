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

function ClubInfoScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const toggleExpansion = (index) => {
    setIsExpanded(index);
  };

  return (
    <View className="w-full h-full px-3">
      {/* <View className="flex flex-row w-auto p-2 mx-3 mt-2 bg-white rounded-lg">
        <TouchableOpacity className="items-center justify-center w-1/2 px-3 py-2 text-center bg-orange-400 rounded">
          <Text className="text-base font-bold text-white">Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center justify-center w-1/2 px-3 py-2 text-center rounded"
          onPress={() => {
            navigation.navigate("ClubTeams", {
              guid: guid,
            });
          }}
        >
          <Text className="text-base font-bold text-gray-700">Teams</Text>
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
              <View className="flex items-center flex-1 gap-1 px-5 py-4 text-center bg-white rounded">
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
              <View className="space-y-2">
                <Text className="text-lg font-bold">Contactgegevens</Text>
                <TouchableOpacity
                  onPress={() => {
                    var website = item.website;
                    if (
                      item.website != null &&
                      !item.website.startsWith("http")
                    ) {
                      website = "https://" + website;
                    }

                    item.website !== null ? Linking.openURL(website) : null;
                  }}
                  className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                >
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="items-center justify-center text-lg font-bold text-center text-gray-500">
                      <Icon
                        name="web"
                        type="foundation"
                        // className="mt-1.5 "
                        className={Platform.OS == "ios" ? "mt-1.5" : "mt-0"}
                        color="#6b7280"
                        solid={true}
                        size={21}
                      />
                    </Text>
                  </View>
                  <Text className="text-gray-500">
                    {item.website ?? "Geen website gevonden..."}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL("mailto:" + item.email)}
                  className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                >
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="items-center justify-center text-lg font-bold text-center text-gray-500">
                      <Icon
                        name="mail"
                        type="ionicon"
                        className={Platform.OS == "ios" ? "mt-1.5" : "mt-0"}
                        color="#6b7280"
                        solid={true}
                        size={19}
                      />
                    </Text>
                  </View>
                  <Text className="text-gray-500">{item.email}</Text>
                </TouchableOpacity>
                <View className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded">
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="items-center justify-center text-lg font-bold text-center text-gray-500">
                      <Icon
                        name="navigate"
                        type="ionicon"
                        className={Platform.OS == "ios" ? "mt-1.5" : "mt-0"}
                        color="#6b7280"
                        solid={true}
                        size={21}
                      />
                    </Text>
                  </View>
                  <Text className="text-gray-500">{item.plaats}</Text>
                </View>
              </View>
              <View className="">
                <Text className="mb-2 text-lg font-bold">Sporthallen</Text>

                {item.accomms.map((location, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        toggleExpansion(index);
                      }}
                      key={index}
                      className="px-3 py-2 mb-2 bg-white rounded"
                    >
                      <View className="flex flex-row items-center justify-between ">
                        <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                          <Text className="items-center justify-center text-lg font-bold text-center text-gray-500">
                            <Icon
                              name="location"
                              type="ionicon"
                              className={
                                Platform.OS == "ios" ? "mt-1.5" : "mt-0"
                              }
                              color="#6b7280"
                              solid={true}
                              size={21}
                            />
                          </Text>
                        </View>
                        <Text className="w-4/5 text-right text-gray-500 ">
                          {location.naam}
                        </Text>
                      </View>

                      {isExpanded != index ?? (
                        <View className="mt-2">
                          <Text className="text-white">
                            More data goes here...
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
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

export default ClubInfoScreen;

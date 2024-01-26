import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import GameCardComponent from "../components/GameCardComponent";

function MatchScreen({ route, navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { guid } = route.params;

  const getMatch = async () => {
    try {
      const response = await fetch(
        "https://vblCB.wisseq.eu/VBLCB_WebService/data/MatchByWedGuid?issguid=" +
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
    getMatch();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.doc.guid}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          disableVirtualization={true}
          className="w-full h-full mt-2"
          renderItem={({ item }) => (
            <View className="space-y-4">
              <GameCardComponent
                game={{
                  guid: item.doc.guid,
                  thuis: {
                    guid: item.doc.teamThuisGUID,
                    naam: item.doc.teamThuisNaam,
                  },
                  uit: {
                    guid: item.doc.teamUitGUID,
                    naam: item.doc.teamUitNaam,
                  },
                  datum: item.doc.datumString,
                  tijd: item.doc.beginTijd,
                  poule: item.doc.pouleNaam,
                  uitslag: item.doc.uitslag,
                  location: item.doc.accommodatieDoc.naam,
                }}
              />
              <View className="px-3 space-y-2">
                <Text className="text-lg font-bold">Scheidsrechters</Text>
                {item.doc.wedOff != null ? (
                  item.doc.wedOff.map((official, index) => {
                    return (
                      <View
                        key={official}
                        className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                      >
                        <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                          <Text className="items-center justify-center text-lg font-bold text-center text-gray-500">
                            {index + 1}
                          </Text>
                        </View>
                        <Text className="text-gray-500">{official}</Text>
                      </View>
                    );
                  })
                ) : (
                  <View className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded">
                    <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                      <Text className="items-center justify-center text-lg font-bold text-center text-gray-500">
                        0
                      </Text>
                    </View>
                    <Text className="justify-end w-2/3 text-gray-500">
                      Geen Scheidsrechters aangeduid...
                    </Text>
                  </View>
                )}
              </View>
              <View className="px-3 space-y-2">
                <Text className="text-lg font-bold">Competities</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Poule", {
                      guid: item.doc.pouleGUID,
                    });
                  }}
                  className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                >
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="items-center justify-center text-lg font-bold text-center text-gray-500">
                      {item.doc.pouleNaam.toLowerCase().includes("beker") ? (
                        <Icon
                          name="trophy"
                          type="ionicon"
                          className={Platform.OS == "ios" ? "mt-1.5" : "mt-0"}
                          color="#6b7280"
                          solid={true}
                          size={19}
                        />
                      ) : (
                        <Icon
                          name="basketball"
                          type="ionicon"
                          className={Platform.OS == "ios" ? "mt-1.5" : "mt-0"}
                          color="#6b7280"
                          solid={true}
                          size={19}
                        />
                      )}
                    </Text>
                  </View>
                  <Text className="flex-wrap w-4/5 text-right text-gray-500">
                    {item.doc.pouleNaam}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="px-3 space-y-2">
                <Text className="text-lg font-bold">Informatie</Text>
                <View className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded">
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="items-center justify-center text-lg font-bold text-center text-gray-500">
                      <Icon
                        name="calendar"
                        type="ionicon"
                        className={Platform.OS == "ios" ? "mt-1.5" : "mt-0"}
                        color="#6b7280"
                        solid={true}
                        size={19}
                      />
                    </Text>
                  </View>
                  <Text className="flex-wrap text-gray-500 capitalize-first">
                    {/* {item.doc.datumString} */}
                    {Intl.DateTimeFormat("nl", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(
                      new Date(
                        `${item.doc.datumString.split("-").reverse().join("-")}`
                      )
                    )}
                  </Text>
                </View>
                <View className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded">
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="items-center justify-center text-lg font-bold text-center text-gray-500">
                      <Icon
                        name="time"
                        type="ionicon"
                        className={Platform.OS == "ios" ? "mt-1.5" : "mt-0"}
                        color="#6b7280"
                        solid={true}
                        size={19}
                      />
                    </Text>
                  </View>
                  <Text className="flex-wrap text-gray-500">
                    {item.doc.beginTijd.replace(".", ":")}
                  </Text>
                </View>
                <View className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded">
                  <View className="items-center justify-center h-8 px-3 bg-gray-100 rounded">
                    <Text className="font-bold text-gray-500">
                      Wedstrijdcode
                    </Text>
                  </View>
                  <Text className="flex-wrap text-gray-500">
                    {item.doc.wedID}
                  </Text>
                </View>
                <View className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded">
                  <View className="items-center justify-center h-8 px-3 bg-gray-100 rounded">
                    <Text className="font-bold text-gray-500">Rondenummer</Text>
                  </View>
                  <Text className="flex-wrap text-gray-500">
                    {item.doc.wedID.slice(-2)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        ></FlatList>
      )}
      {/* <Text>{item.doc.guid}</Text> */}
    </View>
  );
}

export default MatchScreen;

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Icon, Image } from "react-native-elements";

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
              <View className="box-border w-full p-5 bg-white rounded-lg ">
                <View className="flex flex-row items-center justify-between w-full">
                  <View className="items-center justify-center flex-1 w-auto space-y-3">
                    <Image
                      PlaceholderContent={<ActivityIndicator />}
                      placeholderStyle={{ backgroundColor: "#fff" }}
                      cachePolicy="memory"
                      source={{
                        uri:
                          "https://vbl.wisseq.eu/vbldataOrganisation/BVBL" +
                          item.doc.teamThuisGUID.match(/\d+/g)[0] +
                          ".jpg",
                      }}
                      resizeMode="contain"
                      className=" w-11 h-11"
                    />
                    <Text className=" text-[10px] text-center">
                      {item.doc.teamThuisNaam}
                    </Text>
                  </View>

                  <View className="items-center justify-center flex-1 w-auto space-y-1">
                    <Text className="text-sm text-center text-gray-500">
                      {item.doc.pouleNaam.toLowerCase().includes("beker") ? (
                        <Icon
                          name="trophy-outline"
                          type="ionicon"
                          className=""
                          color="#6b7280"
                          size={19}
                        />
                      ) : (
                        <Icon
                          name="basketball-outline"
                          type="ionicon"
                          className=""
                          color="#6b7280"
                          size={19}
                        />
                      )}
                    </Text>
                    <Text className="text-lg font-bold text-center text-orange-400">
                      {item.doc.uitslag == ""
                        ? item.doc.beginTijd.replace(".", ":")
                        : item.doc.uitslag.replace("- ", " / ")}
                    </Text>
                    <Text className="text-xs text-center text-gray-500 uppercase ">
                      {Intl.DateTimeFormat("nl", {
                        // weekday: "long",
                        month: "short",
                        day: "numeric",
                      }).format(
                        new Date(
                          `${item.doc.datumString
                            .split("-")
                            .reverse()
                            .join("-")}`
                        )
                      )}
                    </Text>
                  </View>

                  <View className="items-center justify-center flex-1 w-auto space-y-3">
                    <Image
                      PlaceholderContent={<ActivityIndicator />}
                      placeholderStyle={{ backgroundColor: "#fff" }}
                      cachePolicy="memory"
                      source={{
                        uri:
                          "https://vbl.wisseq.eu/vbldataOrganisation/BVBL" +
                          item.doc.teamUitGUID.match(/\d+/g)[0] +
                          ".jpg",
                      }}
                      resizeMode="contain"
                      className=" w-11 h-11"
                    />
                    <Text className=" text-[10px] text-center">
                      {item.doc.teamUitNaam}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-row items-center justify-center w-full mt-2">
                  <Text className="text-xs text-gray-500">
                    {item.doc.accommodatieDoc.naam}
                  </Text>
                </View>
              </View>
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
                          <Text className="text-lg font-bold text-gray-500">
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
                      <Text className="text-lg font-bold text-gray-500">0</Text>
                    </View>
                    <Text className="justify-end w-2/3 text-gray-500">
                      Geen Scheidsrechters aangeduid...
                    </Text>
                  </View>
                )}
              </View>
              <View className="px-3 space-y-2">
                <Text className="text-lg font-bold">Poule</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Poule", {
                      guid: item.doc.pouleGUID,
                    });
                  }}
                  className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                >
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="text-lg font-bold text-gray-500">
                      {item.doc.pouleNaam.toLowerCase().includes("beker") ? (
                        <Icon
                          name="trophy"
                          type="ionicon"
                          className="mt-1.5"
                          color="#6b7280"
                          solid={true}
                          size={19}
                        />
                      ) : (
                        <Icon
                          name="basketball"
                          type="ionicon"
                          className="mt-1.5"
                          color="#6b7280"
                          solid={true}
                          size={19}
                        />
                      )}
                    </Text>
                  </View>
                  <Text className="flex-wrap text-gray-500">
                    {item.doc.pouleNaam}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="px-3 space-y-2">
                <Text className="text-lg font-bold">Informatie</Text>
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

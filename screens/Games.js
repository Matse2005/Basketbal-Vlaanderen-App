import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Image,
  RefreshControl,
  SafeAreaView,
} from "react-native";

export function GamesScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const favorites = ["BVBL1171J21%20%201", "BVBL1171HSE%20%202"];

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

  const getMatches = async () => {
    var items = [];

    for (const favorite of favorites) {
      try {
        const response = await fetch(
          "https://vblCB.wisseq.eu/VBLCB_WebService/data/TeamMatchesByGuid?teamGuid=" +
            favorite
        );
        const json = await response.json();
        items.push(...json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    function compareDateTime(a, b) {
      const dateA = new Date(
        `${a.datumString.split("-").reverse().join("-")} ${a.beginTijd.replace(
          ".",
          ":"
        )}`
      );
      const dateB = new Date(
        `${b.datumString.split("-").reverse().join("-")} ${b.beginTijd.replace(
          ".",
          ":"
        )}`
      );

      return dateA - dateB;
    }

    // Get the current date
    const currentDate = new Date();

    // Filter the array to only include dates after today
    const filteredData = items.filter((item) => {
      const itemDate = new Date(
        `${item.datumString
          .split("-")
          .reverse()
          .join("-")} ${item.beginTijd.replace(".", ":")}`
      );
      return itemDate > currentDate;
    });

    // Sort the filtered array based on date and time
    filteredData.sort(compareDateTime);

    setData(filteredData);
  };

  useEffect(() => {
    getMatches();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="w-full items-center justify-center"
    >
      <View className="w-full">
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            className="py-2"
            data={data}
            keyExtractor={({ wedID }) => wedID}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            disableVirtualization
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex flex-row justify-between items-center w-full my-2 bg-white p-5 box-border rounded-lg"
                // onPress={() => {
                //   navigation.navigate("Club", {
                //     guid: item.guid,
                //   });
                // }}
              >
                <View className="flex-1 space-y-3 justify-center items-center w-auto">
                  <Image
                    // placeholder={placeholderIcon}
                    // onError={placeholderIcon}
                    cachePolicy="memory"
                    source={{
                      uri:
                        "https://vbl.wisseq.eu/vbldataOrganisation/BVBL" +
                        item.tTGUID.match(/\d+/g)[0] +
                        ".jpg",
                    }}
                    resizeMode="contain"
                    className=" w-11 h-11"
                  />
                  <Text className=" text-[10px]">{item.tTNaam}</Text>
                </View>
                <View className="flex-1 space-y-3 justify-center items-center w-auto">
                  <Image
                    // placeholder={placeholderIcon}
                    // onError={placeholderIcon}
                    cachePolicy="memory"
                    source={{
                      uri:
                        "https://vbl.wisseq.eu/vbldataOrganisation/BVBL" +
                        item.tUGUID.match(/\d+/g)[0] +
                        ".jpg",
                    }}
                    resizeMode="contain"
                    className=" w-11 h-11"
                  />
                  <Text className=" text-[10px]">{item.tUNaam}</Text>
                </View>
              </TouchableOpacity>
            )}
          ></FlatList>
        )}
      </View>
    </SafeAreaView>
  );
}

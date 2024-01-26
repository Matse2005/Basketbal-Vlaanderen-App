import React, { useEffect, useState } from "react";
import {
  StatusBar,
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import GameComponent from "../components/GameComponent";
import { Icon, Image } from "react-native-elements";

function GamesScreen({ route, navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  var [dates, setDates] = useState({});

  const { givenDate } = route.params;

  const [date, setDate] = useState(
    // givenDate ??
    //   new Date()
    //     .toLocaleDateString("nl-BE", {
    //       year: "numeric",
    //       month: "numeric",
    //       day: "numeric",
    //     })
    //     .replaceAll("/", "-")
    "27-01-2024"
  );

  // console.log(date);

  const favorites = [
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

  function findClosestDate(targetDateString, dateArray) {
    const targetDate = new Date(
      targetDateString.split("-").reverse().join("-")
    );

    // Convert the array of strings to an array of Date objects
    const possibleDates = dateArray.map(
      (dateString) => new Date(dateString.split("-").reverse().join("-"))
    );

    // possibleDates.forEach((dateString) =>
    //   console.log(new Date(dateString.split("-").reverse().join("-")))
    // );

    // Calculate the differences between each date and the target date
    const differences = possibleDates.map((date) => date - targetDate);

    // Filter out negative differences (dates in the past)
    const positiveDifferences = differences.filter((diff) => diff >= 0);

    // Find the minimum positive difference
    const minDifference = Math.min(...positiveDifferences);

    // Find the index of the closest date
    const closestDateIndex = differences.indexOf(minDifference);

    // Return the closest date
    // console.log(targetDate);
    // console.log(dateArray[closestDateIndex]);
    return dateArray[closestDateIndex];
    // return "27-01-2024";
  }

  const getDates = async (matches) => {
    var returnDates = {};
    var allDates = [];

    matches.forEach((match) => {
      if (!allDates.includes(match.datumString)) {
        allDates.push(match.datumString);
      }
    });

    if (!allDates.includes(date)) {
      setDate(findClosestDate(date, allDates));
      // setDate("27-01-2024");
      // console.log(date);
    }

    for (let i = 0; i < allDates.length; i++) {
      if (
        new Date(allDates[i].split("-").reverse().join("-")).toString() ==
        new Date(date.split("-").reverse().join("-")).toString()
      ) {
        returnDates["curr"] = allDates[i];
        returnDates["prev"] = [];
        returnDates["next"] = [];
        if (allDates[i - 1]) returnDates["prev"].push(allDates[i - 1]);
        if (allDates[i - 2]) returnDates["prev"].push(allDates[i - 2]);
        if (allDates[i + 1]) returnDates["next"].push(allDates[i + 1]);
        if (allDates[i + 2]) returnDates["next"].push(allDates[i + 2]);
      }
    }

    // console.log(allDates);

    setDates(returnDates);
    return;
  };

  const getMatches = async () => {
    try {
      var items = [];

      for (const favorite of favorites) {
        if (favorite.split("_")[0] == "team") {
          const response = await fetch(
            "https://vblCB.wisseq.eu/VBLCB_WebService/data/TeamMatchesByGuid?teamGuid=" +
              favorite.split("_")[1]
          );
          const json = await response.json();
          items = [...items, ...json];
        }
      }

      function compareDateTime(a, b) {
        const dateA = new Date(
          `${a.datumString
            .split("-")
            .reverse()
            .join("-")} ${a.beginTijd.replace(".", ":")}`
        );
        const dateB = new Date(
          `${b.datumString
            .split("-")
            .reverse()
            .join("-")} ${b.beginTijd.replace(".", ":")}`
        );

        return dateA - dateB;
      }

      items.sort(compareDateTime);

      const filtered = items.filter(
        (item) =>
          new Date(
            item.datumString.split("-").reverse().join("-")
          ).toString() ==
          new Date(date.split("-").reverse().join("-")).toString()
        // new Date("03-02-2024".split("-").reverse().join("-")).toString()
      );

      // getDates(items);
      setData(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
    <SafeAreaView style={{ flex: 1 }} className="items-center w-full ">
      {/* {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View className="flex flex-row items-center justify-between w-full px-2 pt-2 pb-4 mt-2">
          {dates["next"] && dates["next"][0] ? (
            <TouchableOpacity className="flex items-center justify-center px-3 py-2">
              <Text>←</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="flex items-center justify-center px-3 py-2">
              <Text> </Text>
            </TouchableOpacity>
          )}

          {dates["prev"] && dates["prev"][1] ? (
            <TouchableOpacity
              onPress={() => {
                date = dates["prev"][1];
              }}
              className="flex items-center justify-center px-3 py-2"
            >
              <Text className="text-xl font-bold">
                {Intl.DateTimeFormat("nl", {
                  day: "numeric",
                }).format(
                  new Date(dates["prev"][1].split("-").reverse().join("-"))
                )}
              </Text>
              <Text className="text-sm uppercase">
                {Intl.DateTimeFormat("nl", {
                  month: "short",
                }).format(
                  new Date(dates["prev"][1].split("-").reverse().join("-"))
                )}
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              <Text className="text-xl font-bold"> </Text>
              <Text className="text-sm uppercase"> </Text>
            </View>
          )}

          {dates["prev"] && dates["prev"][0] ? (
            <TouchableOpacity className="flex items-center justify-center px-3 py-2">
              <Text className="text-xl font-bold">
                {Intl.DateTimeFormat("nl", {
                  day: "numeric",
                }).format(
                  new Date(dates["prev"][0].split("-").reverse().join("-"))
                )}
              </Text>
              <Text className="text-sm uppercase">
                {Intl.DateTimeFormat("nl", {
                  month: "short",
                }).format(
                  new Date(dates["prev"][0].split("-").reverse().join("-"))
                )}
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              <Text className="text-xl font-bold"> </Text>
              <Text className="text-sm uppercase"> </Text>
            </View>
          )}

          {dates["curr"] ? (
            <TouchableOpacity className="flex items-center justify-center px-3 py-2 bg-orange-400 rounded-lg">
              <Text className="text-xl font-bold text-white">
                {Intl.DateTimeFormat("nl", {
                  day: "numeric",
                }).format(
                  new Date(dates["curr"].split("-").reverse().join("-"))
                )}
              </Text>
              <Text className="text-sm text-white uppercase">
                {Intl.DateTimeFormat("nl", {
                  month: "short",
                }).format(
                  new Date(dates["curr"].split("-").reverse().join("-"))
                )}
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              <Text className="text-xl font-bold"> </Text>
              <Text className="text-sm uppercase"> </Text>
            </View>
          )}

          {dates["next"] && dates["next"][0] ? (
            <TouchableOpacity className="flex items-center justify-center px-3 py-2">
              <Text className="text-xl font-bold">
                {Intl.DateTimeFormat("nl", {
                  day: "numeric",
                }).format(
                  new Date(dates["next"][0].split("-").reverse().join("-"))
                )}
              </Text>
              <Text className="text-sm uppercase">
                {Intl.DateTimeFormat("nl", {
                  month: "short",
                }).format(
                  new Date(dates["next"][0].split("-").reverse().join("-"))
                )}
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              <Text className="text-xl font-bold"> </Text>
              <Text className="text-sm uppercase"> </Text>
            </View>
          )}

          {dates["next"] && dates["next"][1] ? (
            <TouchableOpacity className="flex items-center justify-center px-3 py-2">
              <Text className="text-xl font-bold">
                {Intl.DateTimeFormat("nl", {
                  day: "numeric",
                }).format(
                  new Date(dates["next"][1].split("-").reverse().join("-"))
                )}
              </Text>
              <Text className="text-sm uppercase">
                {Intl.DateTimeFormat("nl", {
                  month: "short",
                }).format(
                  new Date(dates["next"][1].split("-").reverse().join("-"))
                )}
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              <Text className="text-xl font-bold"> </Text>
              <Text className="text-sm uppercase"> </Text>
            </View>
          )}

          {dates["next"] && dates["next"][0] ? (
            <TouchableOpacity className="flex items-center justify-center px-3 py-2">
              <Text>→</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="flex items-center justify-center px-3 py-2">
              <Text> </Text>
            </TouchableOpacity>
          )}
        </View>
      )} */}
      <View className="items-center w-full h-full">
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            className="mt-2 mb-24"
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={({ wedID }) => wedID}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            disableVirtualization
            renderItem={({ item }) => (
              <GameComponent
                game={{
                  guid: item.guid,
                  thuis: { guid: item.tTGUID, naam: item.tTNaam },
                  uit: { guid: item.tUGUID, naam: item.tUNaam },
                  datum: item.datumString,
                  tijd: item.beginTijd,
                  poule: item.pouleNaam,
                  uitslag: item.uitslag,
                  location: item.accNaam,
                }}
                navigation={navigation}
              />
            )}
          ></FlatList>
        )}
      </View>
    </SafeAreaView>
  );
}

export default GamesScreen;

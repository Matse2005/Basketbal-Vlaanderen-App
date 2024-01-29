import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  RefreshControl,
  SafeAreaView,
  Text,
} from "react-native";
import GameComponent from "../components/GameComponent";
import { getFavorites } from "../logic/Favorites";
import { NoDataComponent } from "../components/NoData";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { NoFavoriteComponent } from "../components/NoFavorite";
import { useCallback } from "react";

const Tab = createMaterialTopTabNavigator();

function GamesByDateScreen({ route, navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setLoading] = useState(true);
  const [matches, setMatches] = useState(route.params.matches);
  const { date } = route.params;

  useEffect(() => {
    setLoading(false);
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} className="items-center w-full">
      <View className="items-center w-full h-full">
        <View className="items-center w-full px-5 py-4 space-y-4 text-center bg-white rounded">
          <Text className="w-full text-base font-bold text-center text-gray-700">
            {Intl.DateTimeFormat("nl", {
              day: "numeric",
              // weekday: "long",
              month: "short",
              year: "numeric",
            }).format(new Date(`${date.split("-").reverse().join("-")}`))}
          </Text>
        </View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            className="mt-2"
            data={matches}
            showsVerticalScrollIndicator={false}
            keyExtractor={(match, index) => match.wedID + index}
            ListEmptyComponent={<NoDataComponent />}
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

function GamesScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [focusedDate, setFocusedDate] = useState(
    new Date().toLocaleDateString("en-GB").replaceAll("/", "-")
  );
  const [allMatches, setMatches] = useState([]);

  const clubMatches = async (guid) => {
    const response = await fetch(
      "https://vblCB.wisseq.eu/VBLCB_WebService/data/OrgMatchesByGuid?issguid=" +
        guid
    );

    const matches = await response.json();
    return matches;
  };

  const teamMatches = async (guid) => {
    const response = await fetch(
      "https://vblCB.wisseq.eu/VBLCB_WebService/data/TeamMatchesByGuid?teamGuid=" +
        guid
    );

    const matches = await response.json();
    return matches;
  };

  const pouleMatches = async (guid) => {
    const response = await fetch(
      "https://vblCB.wisseq.eu/VBLCB_WebService/data/PouleMatchesByGuid?issguid=" +
        guid
    );

    const matches = await response.json();
    return matches;
  };

  const retrieveMatches = async (favorites) => {
    var matches = [];

    await Promise.all(
      favorites.map(async (favorite) => {
        const [type, guid] = favorite.split("_");

        switch (type) {
          case "club":
            matches.push(...(await clubMatches(guid)));
            break;
          case "team":
            matches.push(...(await teamMatches(guid)));
            break;
          case "poule":
            matches.push(...(await pouleMatches(guid)));
            break;
        }
      })
    );

    return matches;
  };

  const removeDuplicateMatches = (matches) => {
    var seen = {};
    var uniqueItems = [];

    for (var i = 0; i < matches.length; i++) {
      var currentItem = matches[i];
      var currentGuidValue = currentItem["guid"];

      if (!seen[currentGuidValue]) {
        seen[currentGuidValue] = 1;
        uniqueItems.push(currentItem);
      } else {
        seen[currentGuidValue]++;
      }
    }

    return uniqueItems;
  };

  const sortMatches = (matches) => {
    function compareDateTime(a, b) {
      const dateA = new Date(
        `${a.datumString.split("-").reverse().join("-")} ${
          a.beginTijd !== "" ? a.beginTijd.replace(".", ":") : "00:00"
        }`
      );
      const dateB = new Date(
        `${b.datumString.split("-").reverse().join("-")} ${
          b.beginTijd !== "" ? b.beginTijd.replace(".", ":") : "00:00"
        }`
      );

      return dateA - dateB;
    }

    matches.sort(compareDateTime);

    return matches;
  };

  const extractDates = (matches) => {
    var extractedDates = [];
    matches.forEach((match) => {
      if (!extractedDates.includes(match.datumString)) {
        extractedDates.push(match.datumString);
      }
    });

    return extractedDates;
  };

  const startDate = (startDate, dates) => {
    const targetDate = new Date(startDate.split("-").reverse().join("-"));
    const datesDateFormat = dates.map(
      (dateString) => new Date(dateString.split("-").reverse().join("-"))
    );

    if (datesDateFormat.includes(targetDate)) {
      return startDate;
    }

    // Calculate the differences between each date and the target date
    const differences = datesDateFormat.map((date) => date - targetDate);

    // Filter out negative differences (dates in the past)
    const positiveDifferences = differences.filter((diff) => diff >= 0);

    // Find the minimum positive difference
    const minDifference = Math.min(...positiveDifferences);

    // Find the index of the closest date
    const closestDateIndex = differences.indexOf(minDifference);

    // Return the closest date
    return dates[closestDateIndex];
  };

  const getDates = async (startdate) => {
    try {
      setFavorites(await getFavorites());
      await retrieveMatches(await getFavorites()).then((matches) => {
        const uniqueMatches = removeDuplicateMatches(matches);
        const sortedMatches = sortMatches(uniqueMatches);
        const possibleDates = extractDates(sortedMatches);
        startdate = startDate(startdate, possibleDates);

        setFocusedDate(startdate);
        setMatches(sortedMatches);
        setDates(possibleDates);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDates(
      new Date()
        .toLocaleDateString("nl-BE", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })
        .toString()
        .replaceAll("/", "-")
    );
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : favorites.length > 0 ? (
    dates.length > 0 ? (
      <Tab.Navigator
        className="w-full"
        indicatorStyle={{ backgroundColor: "#fb923c", height: 2 }}
        initialRouteName={focusedDate}
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: 700,
            textTransform: "none",
            color: "#000",
          },
          tabBarActiveTintColor: "#fb923c",
          tabBarInactiveTintColor: "#374151",
          tabBarItemStyle: {
            borderRadius: 4,
          },
          tabBarStyle: {
            backgroundColor: "white",
            display: "none",
          },
          headerShown: false,
          lazy: true,
        }}
      >
        {dates.map((date) => {
          return (
            <Tab.Screen
              key={date}
              name={date}
              component={GamesByDateScreen}
              options={{
                title: date,
              }}
              initialParams={{
                date: date,
                matches: allMatches.filter(
                  (match) =>
                    new Date(
                      match.datumString.split("-").reverse().join("-")
                    ).toString() ==
                    new Date(date.split("-").reverse().join("-")).toString()
                ),
              }}
            />
          );
        })}
      </Tab.Navigator>
    ) : (
      <View className="flex items-center justify-center h-full px-3">
        <NoDataComponent />
      </View>
    )
  ) : (
    <View className="flex items-center justify-center h-full px-3">
      <NoFavoriteComponent />
    </View>
  );
}

export default GamesScreen;

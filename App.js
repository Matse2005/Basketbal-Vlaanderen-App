// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  StatusBar,
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Button,
  RefreshControl,
  SafeAreaView,
  AsyncStorage,
  TextInput,
  Linking,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon, Image } from "react-native-elements";

function GamesScreen({ navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const favorites = [
    "BVBL1171J21%20%201",
    "BVBL1171HSE%20%202",
    "BVBL1171DSE%20%201",
    "BVBL1171HSE%20%201",
    "BVBL1171J18%20%201",
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

    items.sort(compareDateTime);

    setData(items);
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
      <StatusBar
        animated={true}
        barStyle="dark-content"
        showHideTransition="fade"
      />
      <View className="flex flex-row items-center justify-between w-full px-2 pt-2 pb-4 mt-2">
        <TouchableOpacity className="flex items-center justify-center px-3 py-2">
          <Text>←</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex items-center justify-center px-3 py-2">
          <Text className="text-xl font-bold">16</Text>
          <Text className="text-sm">Maa</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex items-center justify-center px-3 py-2">
          <Text className="text-xl font-bold">17</Text>
          <Text className="text-sm">Maa</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex items-center justify-center px-3 py-2 bg-orange-400 rounded-lg">
          <Text className="text-xl font-bold text-white">18</Text>
          <Text className="text-sm text-white">Maa</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex items-center justify-center px-3 py-2">
          <Text className="text-xl font-bold">19</Text>
          <Text className="text-sm">Maa</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex items-center justify-center px-3 py-2">
          <Text className="text-xl font-bold">20</Text>
          <Text className="text-sm">Maa</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex items-center justify-center px-3 py-2">
          <Text>→</Text>
        </TouchableOpacity>
      </View>
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
              <TouchableOpacity
                className="box-border w-full p-5 mb-4 bg-white rounded-lg "
                onPress={() => {
                  navigation.navigate("Match", {
                    guid: item.guid,
                  });
                }}
              >
                <View className="flex flex-row items-center justify-between w-full">
                  <View className="items-center justify-center flex-1 w-auto space-y-3">
                    <Image
                      PlaceholderContent={<ActivityIndicator />}
                      placeholderStyle={{ backgroundColor: "#fff" }}
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
                    <Text className=" text-[10px] text-center">
                      {item.tTNaam}
                    </Text>
                  </View>

                  <View className="items-center justify-center flex-1 w-auto space-y-1">
                    <Text className="text-lg font-bold text-center text-orange-400">
                      {item.uitslag == ""
                        ? item.beginTijd.replace(".", ":")
                        : item.uitslag.replace("- ", " / ")}
                    </Text>
                    <Text className="text-xs text-center text-gray-500 uppercase ">
                      {Intl.DateTimeFormat("nl", {
                        // weekday: "long",
                        month: "short",
                        day: "numeric",
                      }).format(
                        new Date(
                          `${item.datumString.split("-").reverse().join("-")}`
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
                          item.tUGUID.match(/\d+/g)[0] +
                          ".jpg",
                      }}
                      resizeMode="contain"
                      className=" w-11 h-11"
                    />
                    <Text className=" text-[10px] text-center">
                      {item.tUNaam}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-row items-center justify-center w-full mt-2">
                  <Text className="text-xs text-gray-500">{item.accNaam}</Text>
                </View>
              </TouchableOpacity>
              // <TouchableOpacity className=""></TouchableOpacity>
            )}
          ></FlatList>
        )}
      </View>
    </SafeAreaView>
  );
}

function FavoritesScreen({ navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const [teams, setTeams] = useState([]);

  const favorites = [
    "club_BVBL1255",
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

  const getTeams = async () => {
    var items = [];

    for (const favorite of favorites) {
      if (favorite.split("_")[0] == "team") {
        try {
          const response = await fetch(
            "https://vblCB.wisseq.eu/VBLCB_WebService/data/TeamDetailByGuid?teamGuid=" +
              favorite.split("_")[1]
          );
          const json = await response.json();
          items.push(...json);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }

    setTeams(items);
  };

  const getClubs = async () => {
    var items = [];

    for (const favorite of favorites) {
      if (favorite.split("_")[0] == "club") {
        try {
          const response = await fetch(
            "https://vblCB.wisseq.eu/VBLCB_WebService/data/OrgDetailByGuid?issguid=" +
              favorite.split("_")[1]
          );
          const json = await response.json();
          items.push(...json);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }

    setClubs(items);
  };

  useEffect(() => {
    getClubs();
    getTeams();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView className="w-full h-full">
      <ScrollView className="w-full h-full px-3 py-2 mb-3">
        <Text className="my-2 text-lg font-bold">Teams</Text>
        {teams.map((team, index) => {
          return (
            <View className="mb-2" key={index}>
              <TouchableOpacity
                className="box-border w-full p-5 bg-white rounded-lg "
                onPress={() => {
                  navigation.navigate("Club", {
                    guid: team.guid,
                  });
                }}
              >
                <View className="flex flex-row items-center justify-between w-full">
                  <View className="justify-center flex-1 w-auto space-y-3">
                    <Text className="font-bold text-gray-700">{team.naam}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
        <Text className="my-2 text-lg font-bold">Clubs</Text>
        {clubs.map((club, index) => {
          return (
            <View className="mb-2" key={index}>
              <TouchableOpacity
                className="box-border w-full p-5 bg-white rounded-lg "
                onPress={() => {
                  navigation.navigate("Club", {
                    guid: club.guid,
                  });
                }}
              >
                <View className="flex flex-row items-center justify-between w-full">
                  <View className="justify-center flex-1 w-auto space-y-3">
                    <Text className="font-bold text-gray-700">{club.naam}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function ClubsScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [recieved, setRecieved] = useState([]);
  const [searchText, setSearchText] = useState("");

  const searchFunction = (text) => {
    setSearchText(text);
    text = text.toLowerCase();
    if (text === "") {
      setData(recieved);
    } else {
      let filteredData = recieved.filter((item) =>
        item.naam.toLowerCase().includes(text)
      );
      setData(filteredData);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Club", {
          guid: item.guid,
        });
      }}
      className="w-full "
    >
      <View
        name="Clubs"
        component={ClubInfoScreen}
        options={{ title: item.naam, guid: item.guid }}
        className="w-full p-5 my-1 text-sm bg-white rounded-lg items-left"
      >
        {/* <Image
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
          className=" w-11 h-11"
        /> */}
        <Text>{item.naam}</Text>
      </View>
    </TouchableOpacity>
  );

  const getClubs = async () => {
    try {
      const response = await fetch(
        "https://vblCB.wisseq.eu/VBLCB_WebService/data/OrgList?p=1"
      );
      const json = await response.json();
      setRecieved(json);
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClubs();
  }, []);

  return (
    <View className="flex-1 w-full px-3">
      <View className="relative w-full">
        <View className="absolute z-10 flex items-center justify-center top-5 left-5">
          <Icon name="search" type="octicons" className="" />
        </View>
        <TextInput
          placeholderTextColor="black"
          placeholder="Zoek..."
          className="block w-full py-3 pl-12 pr-5 my-2 text-sm bg-white rounded-lg z-9"
          value={searchText}
          onChangeText={(text) => searchFunction(text)}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ guid }) => guid}
          showsVerticalScrollIndicator={false}
          disableVirtualization={true}
          className="w-full mt-2"
          renderItem={renderItem}
        ></FlatList>
      )}
    </View>
  );
}

// function ClubScreen({ route, navigation }) {
//   const { guid } = route.params;

//   state = {
//     index: 0,
//     routes: [
//       { key: "club_info", title: "Club Info" },
//       { key: "club_teams", title: "Club Teams" },
//     ],
//   };

//   _handleIndexChange = (index) => this.setState({ index });

//   _renderTabBar = (props) => {
//     const inputRange = props.navigationState.routes.map((x, i) => i);

//     return (
//       <View style={styles.tabBar}>
//         {props.navigationState.routes.map((route, i) => {
//           const opacity = props.position.interpolate({
//             inputRange,
//             outputRange: inputRange.map((inputIndex) =>
//               inputIndex === i ? 1 : 0.5
//             ),
//           });

//           return (
//             <TouchableOpacity
//               style={styles.tabItem}
//               onPress={() => this.setState({ index: i })}
//             >
//               <Animated.Text style={{ opacity }}>{route.title}</Animated.Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     );
//   };

//   _renderScene = SceneMap({
//     club_info: ClubInfoScreen,
//     club_team: ClubTeamsScreen,
//   });

//   function render() {
//     return (
//       <TabView
//         navigationState={this.state}
//         renderScene={this._renderScene}
//         renderTabBar={this._renderTabBar}
//         onIndexChange={this._handleIndexChange}
//       />
//     );
//   }

//   render
// }

function ClubInfoScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState([]);
  const { guid } = route.params;

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
    <SafeAreaView className="w-full h-full px-3">
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
              <View className="flex items-center flex-1 gap-1 px-5 py-4 text-center bg-white">
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
              <View className="px-3 space-y-2">
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
                    <Text className="text-lg font-bold text-gray-500">
                      <Icon
                        name="web"
                        type="foundation"
                        className="mt-1.5"
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
                    <Text className="text-lg font-bold text-gray-500">
                      <Icon
                        name="mail"
                        type="ionicon"
                        className="mt-1.5"
                        color="#6b7280"
                        solid={true}
                        size={19}
                      />
                    </Text>
                  </View>
                  <Text className="text-gray-500">{item.email}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded">
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="text-lg font-bold text-gray-500">
                      <Icon
                        name="navigate"
                        type="ionicon"
                        className="mt-1.5"
                        color="#6b7280"
                        solid={true}
                        size={21}
                      />
                    </Text>
                  </View>
                  <Text className="text-gray-500">{item.plaats}</Text>
                </TouchableOpacity>
              </View>
              <View className="px-3 space-y-2">
                <Text className="text-lg font-bold">Sporthallen</Text>
                {/* <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(item.website);
                  }}
                  className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                >
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="text-lg font-bold text-gray-500">
                      <Icon
                        name="location"
                        type="ionicon"
                        className="mt-1.5"
                        color="#6b7280"
                        solid={true}
                        size={21}
                      />
                    </Text>
                  </View>
                  <Text className="text-gray-500">{item.website}</Text>
                </TouchableOpacity> */}

                {item.accomms.map((location, index) => {
                  return (
                    // <TouchableOpacity
                    //   key={index}
                    //   // onPress={() => {
                    //   //   Linking.openURL(item.website);
                    //   // }}
                    //   className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                    // >
                    //   <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    //     <Text className="text-lg font-bold text-gray-500">
                    //       <Icon
                    //         name="location"
                    //         type="ionicon"
                    //         className="mt-1.5"
                    //         color="#6b7280"
                    //         solid={true}
                    //         size={21}
                    //       />
                    //     </Text>
                    //   </View>
                    //   <Text className="text-gray-500">{location.naam}</Text>
                    // </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        toggleExpansion(index);
                      }}
                      key={index}
                      className="px-3 py-2 bg-white rounded"
                    >
                      <View className="flex flex-row items-center justify-between ">
                        <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                          <Text className="text-lg font-bold text-gray-500">
                            <Icon
                              name="location"
                              type="ionicon"
                              className="mt-1.5"
                              color="#6b7280"
                              solid={true}
                              size={21}
                            />
                          </Text>
                        </View>
                        <Text className="text-gray-500">{location.naam}</Text>
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
    </SafeAreaView>
  );
}

function ClubTeamsScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);
  const { guid } = route.params;

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

  return (
    <SafeAreaView className="w-full h-full px-3">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          className="h-full mt-2 mb-24"
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={({ guid }) => guid}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          disableVirtualization
          renderItem={({ item }) => (
            <View className="h-full space-y-4">
              <View className="flex items-center flex-1 gap-1 px-5 py-4 text-center bg-white">
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
              <View className="px-3 space-y-2">
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

                    !item.website ?? Linking.openURL(website);
                  }}
                  className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                >
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="text-lg font-bold text-gray-500">
                      <Icon
                        name="web"
                        type="foundation"
                        className="mt-1.5"
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
                    <Text className="text-lg font-bold text-gray-500">
                      <Icon
                        name="mail"
                        type="ionicon"
                        className="mt-1.5"
                        color="#6b7280"
                        solid={true}
                        size={19}
                      />
                    </Text>
                  </View>
                  <Text className="text-gray-500">{item.email}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  // key={index}
                  // onPress={() => {
                  //   Linking.openURL(item.website);
                  // }}
                  className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                >
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="text-lg font-bold text-gray-500">
                      <Icon
                        name="location"
                        type="ionicon"
                        className="mt-1.5"
                        color="#6b7280"
                        solid={true}
                        size={21}
                      />
                    </Text>
                  </View>
                  <Text className="text-gray-500">{item.plaats}</Text>
                </TouchableOpacity>
              </View>
              <View className="px-3 space-y-2">
                <Text className="text-lg font-bold">Sporthallen</Text>
                {/* <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(item.website);
                  }}
                  className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                >
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="text-lg font-bold text-gray-500">
                      <Icon
                        name="location"
                        type="ionicon"
                        className="mt-1.5"
                        color="#6b7280"
                        solid={true}
                        size={21}
                      />
                    </Text>
                  </View>
                  <Text className="text-gray-500">{item.website}</Text>
                </TouchableOpacity> */}

                {item.accomms.map((location, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      // onPress={() => {
                      //   Linking.openURL(item.website);
                      // }}
                      className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                    >
                      <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                        <Text className="text-lg font-bold text-gray-500">
                          <Icon
                            name="location"
                            type="ionicon"
                            className="mt-1.5"
                            color="#6b7280"
                            solid={true}
                            size={21}
                          />
                        </Text>
                      </View>
                      <Text className="text-gray-500">{location.naam}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        ></FlatList>
      )}
    </SafeAreaView>
  );
}

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
                    <Text className="text-gray-500">
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

function PouleScreen({ route }) {
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

  useEffect(() => {
    getPoule();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
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
          className="w-full h-full mt-2"
          renderItem={({ item }) => (
            <View className="mt-2 space-y-4 ">
              <View className="flex flex-row items-center justify-between px-3 py-2 text-center bg-white rounded">
                <View className="flex items-center justify-center w-full h-8 text-center">
                  <Text className="font-bold text-gray-500">{item.naam}</Text>
                </View>
              </View>
              <View className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded">
                <View className="flex flex-row items-center space-x-2">
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="font-bold text-gray-500">Nr</Text>
                  </View>
                  <Text className="text-gray-500">Naam</Text>
                </View>
                <View className="flex flex-row items-center space-x-2">
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="text-gray-500">#</Text>
                  </View>
                  <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                    <Text className="text-gray-500">Pt</Text>
                  </View>
                </View>
              </View>
              <View className="space-y-2">
                {item.teams.map((team) => {
                  return (
                    <View
                      key={team.guid}
                      className="flex flex-row items-center justify-between px-3 py-2 bg-white rounded"
                    >
                      <View className="flex flex-row items-center space-x-2 break-words">
                        <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
                          <Text className="text-lg font-bold text-gray-500">
                            {team.rangNr.replace(" ", "")}
                          </Text>
                        </View>
                        <Text className="text-gray-500 break-words">
                          {team.naam}
                        </Text>
                      </View>
                      <View className="flex flex-row items-center space-x-2">
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

const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator
      activeColor="#fb923c"
      screenOptions={{
        activeTintColor: "#fb923c",

        tabBarActiveTintColor: "#fb923c",
      }}
    >
      <Tab.Screen
        name="Games"
        component={GamesScreen}
        options={{
          title: "Wedstrijden",
          headerBackVisible: false,
          gestureEnabled: false,
          tabBarIcon: ({ color, focused }) => {
            return (
              <Icon
                name={focused ? "calendar" : "calendar-outline"}
                type="ionicon"
                color={color}
              />
            );
          },
        }}
        initialParams={{
          // givenDate: null,
          givenDate: null,
        }}
      />
      <Tab.Screen
        name="Clubs"
        component={ClubsScreen}
        options={{
          title: "Clubs",
          headerBackVisible: false,
          gestureEnabled: false,
          tabBarIcon: ({ color, focused }) => {
            return (
              <Icon
                name={focused ? "basketball" : "basketball-outline"}
                type="ionicon"
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: "Favorieten",
          headerBackVisible: false,
          gestureEnabled: false,
          tabBarIcon: ({ color, focused }) => {
            return (
              <Icon
                name={focused ? "star" : "star-outline"}
                type="ionicon"
                color={color}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <StatusBar
        animated={true}
        barStyle="dark-content"
        showHideTransition="fade"
      />
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          // headerTintColor="#fb923c"
          options={{
            title: "",
            headerBackVisible: false,
            headerShown: false,
            // gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Club"
          component={ClubInfoScreen}
          options={{ title: "Clubs", guid: null }}
        />
        <Stack.Screen
          name="Match"
          component={MatchScreen}
          options={{ title: "Match", guid: null }}
        />
        <Stack.Screen
          name="Poule"
          component={PouleScreen}
          options={{ title: "Poule", guid: null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

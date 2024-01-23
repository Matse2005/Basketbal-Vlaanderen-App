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

function RankingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>
    </View>
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
        component={ClubScreen}
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
      <StatusBar
        animated={true}
        barStyle="dark-content"
        showHideTransition="fade"
      />
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

function ClubScreen({ route }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { guid } = route.params;

  const getClubs = async () => {
    try {
      const response = await fetch(
        "https://vblCB.wisseq.eu/VBLCB_WebService/data/OrgList?p=1"
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
    getClubs();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Club Screen</Text>
      <Text>{guid}</Text>
    </View>
  );
}

function MatchScreen({ route }) {
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
            <View>
              <View className="box-border w-full p-5 mb-4 bg-white rounded-lg ">
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
              <View>
                <Text className="text-lg font-bold">Scheidsrechters</Text>
                {item.doc.wedOff != null ? (
                  item.doc.wedOff.map((official) => {
                    return (
                      <View key={official}>
                        <Text>{official}</Text>
                      </View>
                    );
                  })
                ) : (
                  <View>
                    <Text>Nog geen aangeduid</Text>
                  </View>
                )}
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
    <Tab.Navigator activeColor="#fb923c">
      <Tab.Screen
        name="Games"
        component={GamesScreen}
        options={{
          title: "Wedstrijden",
          headerBackVisible: false,
          gestureEnabled: false,
          tabBarIcon: ({ color }) => {
            return <Icon name="calendar" type="feather" color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Rankings"
        component={RankingsScreen}
        options={{
          title: "Rangschikkingen",
          headerBackVisible: false,
          gestureEnabled: false,
          tabBarIcon: ({ color }) => {
            return <Icon name="podium-outline" type="ionicon" color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Clubs"
        component={ClubsScreen}
        options={{
          title: "Clubs",
          headerBackVisible: false,
          gestureEnabled: false,
          tabBarIcon: ({ color }) => {
            return (
              <Icon name="basketball-outline" type="ionicon" color={color} />
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
          component={ClubScreen}
          options={{ title: "Clubs", guid: null }}
        />
        <Stack.Screen
          name="Match"
          component={MatchScreen}
          options={{ title: "Match", guid: null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

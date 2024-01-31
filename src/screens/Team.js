import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import MatchesScreen from "./Team/Matches";
import PlayersScreen from "./Team/Players";
import PoulesScreen from "./Team/Poules";
import { Icon } from "react-native-elements";
import { checkFavorite, toggleFavorite } from "../logic/Favorites";
import { useEffect } from "react";

const Tab = createMaterialTopTabNavigator();

function TeamScreen({ route, navigation }) {
  const { guid } = route.params;

  const setIcon = async () => {
    var favorite = null;

    await checkFavorite(guid, "team").then(function (favoriteState) {
      favorite = favoriteState;
    });

    navigation.setOptions({
      headerRight: () => (
        <Icon
          name={favorite ? "heart" : "heart-outline"}
          type="ionicon"
          onPress={() => {
            toggleFavorite(guid, "team").then(() => {
              setIcon();
            });
          }}
          color="#fb923c"
        />
      ),
    });
  };

  useEffect(() => {
    setIcon();
  }, []);

  return (
    <Tab.Navigator
      indicatorStyle={{ backgroundColor: "#fb923c", height: 2 }}
      screenOptions={{
        // tabBarGap: 10,
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: 700,
          textTransform: "none",
        },
        tabBarActiveTintColor: "#fb923c",
        tabBarInactiveTintColor: "#374151",
        tabBarItemStyle: {
          // backgroundColor: "#fb923c",
          borderRadius: 4,
          // flex: 1,
        },
        tabBarStyle: {
          backgroundColor: "white",
          // flex: 1,
          // padding: 8,
          // marginHorizontal: 4,
          // maxWidth: Dimensions.get("window").width,
        },
      }}
      // tabBar={(props) => <ClubNav {...props} />}
    >
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{ title: "Matchen" }}
        initialParams={{
          guid: guid,
        }}
      />
      <Tab.Screen
        name="Poules"
        component={PoulesScreen}
        options={{ title: "Competities" }}
        initialParams={{
          guid: guid,
        }}
      />
      <Tab.Screen
        name="Players"
        component={PlayersScreen}
        options={{ title: "Spelers/TV" }}
        initialParams={{
          guid: guid,
        }}
      />
    </Tab.Navigator>
  );
}

export default TeamScreen;

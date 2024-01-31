import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import ClubInfoScreen from "./Club/Info";
import ClubTeamsScreen from "./Club/Teams";
import { useEffect } from "react";
import { Icon } from "react-native-elements";
import { checkFavorite, toggleFavorite } from "../logic/Favorites";

const Tab = createMaterialTopTabNavigator();

function ClubScreen({ route, navigation }) {
  const { guid } = route.params;

  const setIcon = async () => {
    var favorite = null;

    await checkFavorite(guid, "club").then(function (favoriteState) {
      favorite = favoriteState;
    });

    navigation.setOptions({
      headerRight: () => (
        <Icon
          name={favorite ? "heart" : "heart-outline"}
          type="ionicon"
          onPress={() => {
            toggleFavorite(guid, "club").then(() => {
              setIcon();
            });
          }}
          color="#fb923c"
        />
      ),
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setIcon();
    }, 200);
  }, []);

  return (
    <Tab.Navigator
      indicatorStyle={{ backgroundColor: "#fb923c", height: 2 }}
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: 700,
          textTransform: "capitalize",
        },
        tabBarActiveTintColor: "#fb923c",
        tabBarInactiveTintColor: "#374151",
        tabBarItemStyle: {
          borderRadius: 4,
        },
        tabBarStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Tab.Screen
        name="Info"
        component={ClubInfoScreen}
        initialParams={{
          guid: guid,
        }}
      />
      <Tab.Screen
        name="Teams"
        component={ClubTeamsScreen}
        initialParams={{
          guid: guid,
        }}
      />
    </Tab.Navigator>
  );
}

export default ClubScreen;

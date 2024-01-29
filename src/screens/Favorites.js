import {
  Animated,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import FavoritesClubScreen from "./Favorites/Club";
import FavoritesPouleScreen from "./Favorites/Poule";
import FavoritesTeamScreen from "./Favorites/Team";

const Tab = createMaterialTopTabNavigator();

function FavoritesScreen({ route, navigation }) {
  return (
    <Tab.Navigator
      indicatorStyle={{ backgroundColor: "#fb923c", height: 2 }}
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: 700,
          textTransform: "none",
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
        name="Teams"
        component={FavoritesTeamScreen}
        options={{ title: "Teams" }}
      />
      <Tab.Screen
        name="Clubs"
        component={FavoritesClubScreen}
        options={{ title: "Clubs" }}
      />
      <Tab.Screen
        name="Poules"
        component={FavoritesPouleScreen}
        options={{ title: "Competities" }}
      />
    </Tab.Navigator>
  );
}

export default FavoritesScreen;

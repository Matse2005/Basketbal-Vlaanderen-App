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
  Dimensions,
  TextInput,
  Linking,
  Animated,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon, Image } from "react-native-elements";
import { TabView, SceneMap } from "react-native-tab-view";

// Screens
import GamesScreen from "./src/screens/Games";
import ClubsScreen from "./src/screens/Clubs";
import FavoritesScreen from "./src/screens/Favorites";
import MatchScreen from "./src/screens/Match";
import PouleScreen from "./src/screens/Poule";
import ClubScreen from "./src/screens/Club";
import TeamScreen from "./src/screens/Team";

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
      {/* <Tab.Screen
        name="ClubTest"
        component={ClubScreen}
        options={{
          title: "Club Test",
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
      /> */}
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
          component={ClubScreen}
          options={{ title: "Club" }}
          initialParams={{
            guid: null,
          }}
        />
        <Stack.Screen
          name="Team"
          component={TeamScreen}
          options={{ title: "Team" }}
          initialParams={{
            guid: null,
          }}
        />
        <Stack.Screen
          name="Match"
          component={MatchScreen}
          options={{ title: "Match" }}
          initialParams={{
            guid: null,
          }}
        />
        <Stack.Screen
          name="Poule"
          component={PouleScreen}
          options={{ title: "Competitie" }}
          initialParams={{
            guid: null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

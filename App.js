// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Icon } from "react-native-elements";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

// Screens
import GamesScreen from "./src/screens/Games";
import ClubsScreen from "./src/screens/Clubs";
import FavoritesScreen from "./src/screens/Favorites";
import MatchScreen from "./src/screens/Match";
import PouleScreen from "./src/screens/Poule";
import ClubScreen from "./src/screens/Club";
import TeamScreen from "./src/screens/Team";
import BugsScreen from "./src/screens/Bugs";

const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator
      activeColor="#fb923c"
      screenOptions={{
        activeTintColor: "#fb923c",
        tabBarActiveTintColor: "#fb923c",
        animationEnabled: false,
      }}
    >
      <Tab.Screen
        name="Games"
        component={GamesScreen}
        options={{
          title: "Wedstrijden",
          headerBackVisible: false,
          gestureEnabled: false,
          animationEnabled: false,
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
          title: "Favoriete",
          headerBackVisible: false,
          gestureEnabled: false,
          tabBarIcon: ({ color, focused }) => {
            return (
              <Icon
                name={focused ? "heart" : "heart-outline"}
                type="ionicon"
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Bugs"
        component={BugsScreen}
        options={{
          title: "Gekende fouten",
          headerBackVisible: false,
          gestureEnabled: false,
          tabBarIcon: ({ color, focused }) => {
            return (
              <Icon
                name={focused ? "bug" : "bug-outline"}
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
      <ActionSheetProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            // headerTintColor="#fb923c"
            options={{
              title: "",
              headerBackVisible: false,
              headerShown: false,
              gestureEnabled: false,
            }}
            initialParams={{
              givenDate: null,
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
            options={{
              title: "Team",
              // headerRight: () => (
              //   <Button
              //     onPress={() => alert("This is a button!")}
              //     title="Info"
              //     color="#fff"
              //   />
              // ),
            }}
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
            options={{ title: "Rangschikking" }}
            initialParams={{
              guid: null,
            }}
          />
        </Stack.Navigator>
      </ActionSheetProvider>
    </NavigationContainer>
  );
}

export default App;

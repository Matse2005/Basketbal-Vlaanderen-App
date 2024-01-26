import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Games"
          component={Games}
          options={{
            title: "Wedstrijden",
            headerBackVisible: false,
            // gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Rankings"
          component={RankingsScreen}
          options={{
            title: "Rangschikkingen",
            headerBackVisible: false,
            // gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Clubs"
          component={ClubsScreen}
          options={{
            title: "Clubs",
            headerBackVisible: false,
            gestureEnabled: false,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Club"
          component={ClubScreen}
          options={{ title: "Clubs", guid: null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigation;

import { Animated, View, TouchableOpacity, Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import ClubInfoScreen from "./Club/Info";
import ClubTeamsScreen from "./Club/Teams";
import { useEffect } from "react";
import { Icon } from "react-native-elements";
import { checkFavorite, toggleFavorite } from "../logic/Favorites";

const Tab = createMaterialTopTabNavigator();

// function ClubNav({ state, descriptors, navigation, position }) {
//   return (
//     <View
//     // className={{ flex: 1 }}
//     // className="flex flex-row w-auto p-2 mx-3 mt-2 transition duration-300 bg-white rounded-lg"
//     >
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key];
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//             ? options.title
//             : route.name;

//         const isFocused = state.index === index;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: "tabPress",
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name, route.params);
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: "tabLongPress",
//             target: route.key,
//           });
//         };

//         const classes = {
//           normal: {
//             view: "items-center justify-center w-1/2 px-3 py-2 text-center",
//             text: "text-base font-bold text-gray-700",
//           },
//           active: {
//             view: "items-center justify-center w-1/2 px-3 py-2 text-center bg-orange-400 rounded",
//             text: "text-base font-bold text-white",
//           },
//         };

//         const inputRange = state.routes.map((_, i) => i);
//         const background = position.interpolate({
//           inputRange,
//           outputRange: inputRange.map((i) =>
//             i === index ? "#374151" : "#ffffff"
//           ),
//         });

//         // console.log(classes[1]["view"]);

//         return (
//           <TouchableOpacity
//             accessibilityRole="button"
//             accessibilityState={isFocused ? { selected: true } : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarTestID}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             style={{ backgroundColor: background }}
//           >
//             <Animated.Text>{label}</Animated.Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }

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
          textTransform: "capitalize",
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

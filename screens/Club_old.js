// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

// Screens
import ClubInfoScreen from "./Club/Info";
import ClubTeamsScreen from "./Club/Teams";

// function ClubScreen({ route, navigation }) {
//   // const { guid } = route.params;

//   state = {
//     index: 0,
//     routes: [
//       { key: "club_info", title: "Info" },
//       { key: "club_teams", title: "Teams" },
//     ],
//   };

//   _renderTabBar = (props) => {
//     const inputRange = props.navigationState.routes.map((x, i) => i);

//     return (
//       <View className="flex flex-row w-auto p-2 mx-3 mt-2 bg-white rounded-lg">
//         {props.navigationState.routes.map((route, i) => {
//           const classes = props.position.interpolate({
//             outputRange: inputRange.map((inputIndex) =>
//               inputIndex === i
//                 ? "items-center justify-center w-1/2 text-center rounded bg-orange-400 px-3 py-2"
//                 : "items-center justify-center w-1/2 text-center rounded px-3 py-2"
//             ),
//           });

//           return (
//             <TouchableOpacity
//               key={i}
//               on
//               className={classes}
//               onPress={() => this.setState({ index: i })}
//             >
//               <Animated.Text
//                 className={
//                   state.index == i
//                     ? "text-base text-white font-bold"
//                     : "text-base text-gray-700 font-bold"
//                 }
//               >
//                 {route.title}
//               </Animated.Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     );
//   };

//   return (
//     <TabView
//       navigationState={this.state}
//       renderScene={SceneMap({
//         club_info: ClubInfoScreen,
//         club_teams: ClubTeamsScreen,
//       })}
//       renderTabBar={this._renderTabBar}
//       onIndexChange={(index) => {
//         console.log(index);
//         this.setState({ index });
//       }}
//       // initialLayout={{ width: Dimensions.get("window").width }}
//       // style={{ marginTop: StatusBar.currentHeight }}
//     />
//   );
// }

const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#ff4081" }]} />
);
const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#673ab7" }]} />
);

function ClubScreen({ route, navigation }) {
  state = {
    index: 0,
    routes: [
      { key: "first", title: "First" },
      { key: "second", title: "Second" },
    ],
  };

  function render() {
    return (
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
        })}
        onIndexChange={(index) => this.setState({ index })}
        initialLayout={{ width: Dimensions.get("window").width }}
        style={styles.container}
      />
    );
  }

  render();
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
  },
  scene: {
    flex: 1,
  },
});

export default ClubScreen;

// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  // TouchableOpacity,
  Pressable,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import GameCardComponent from "./GameCardComponent";
import { TouchableOpacity } from "react-native-gesture-handler";

function GameComponent({ game, navigation }) {
  return (
    // <Text>{game.thuis.naam}</Text>
    <TouchableOpacity
      // delayPressIn={1000}
      // delayPressIn={}
      className="p-0"
      onPress={() => {
        navigation.navigate("Match", {
          guid: game.guid,
        });
      }}
    >
      <GameCardComponent game={game} />
    </TouchableOpacity>
  );
}

export default GameComponent;

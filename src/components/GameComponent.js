// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import GameCardComponent from "./GameCardComponent";

function GameComponent({ game, navigation }) {
  return (
    // <Text>{game.thuis.naam}</Text>
    <Pressable
      className="p-0"
      onPress={() => {
        navigation.navigate("Match", {
          guid: game.guid,
        });
      }}
    >
      <GameCardComponent game={game} />
    </Pressable>
  );
}

export default GameComponent;

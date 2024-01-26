// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, TouchableOpacity } from "react-native";
import { Icon, Image } from "react-native-elements";
import GameCardComponent from "./GameCardComponent";

function GameComponent({ game, navigation }) {
  return (
    // <Text>{game.thuis.naam}</Text>
    <TouchableOpacity
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

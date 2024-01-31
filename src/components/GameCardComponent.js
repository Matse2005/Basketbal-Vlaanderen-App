// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Linking, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { Image } from "expo-image";

function GameCardComponent({ game }) {
  return (
    <View className="box-border p-5 mb-4 bg-white rounded-lg">
      <View className="flex flex-row items-center justify-between w-full ">
        <View className="items-center justify-center flex-1 w-auto space-y-3">
          <Image
            PlaceholderContent={<ActivityIndicator />}
            placeholderStyle={{ backgroundColor: "#fff" }}
            placeholder={require("../../assets/vbl/icon.png")}
            source={{
              uri:
                "https://vbl.wisseq.eu/vbldataOrganisation/BVBL" +
                game.thuis.guid.match(/\d+/g)[0] +
                ".jpg",
              // cache: "default",
              // priority: FastImage.priority.normal,
            }}
            // decode="async"
            cachePolicy="disk"
            contentFit="contain"
            // resizeMode={FastImage.resizeMode.contain}
            className=" w-11 h-11"
          />
          <Text className=" text-[10px] text-center">{game.thuis.naam}</Text>
        </View>

        <View className="items-center justify-center flex-1 w-auto space-y-1">
          <Text className="text-sm text-center text-gray-500">
            {game.poule.toLowerCase().includes("beker") ? (
              <Icon
                name="trophy-outline"
                type="ionicon"
                className=""
                color="#6b7280"
                size={19}
              />
            ) : (
              <Icon
                name="basketball-outline"
                type="ionicon"
                className=""
                color="#6b7280"
                size={19}
              />
            )}
          </Text>
          <Text className="text-lg font-bold text-center text-orange-400 ">
            {game.uitslag == ""
              ? game.tijd !== ""
                ? game.tijd.replace(".", ":")
                : "Starttijd onbekend"
              : game.uitslag.replaceAll(" ", "").replaceAll("-", " / ")}
          </Text>
          <Text className="text-xs text-center text-gray-500 uppercase ">
            {Intl.DateTimeFormat("nl", {
              // weekday: "long",
              month: "short",
              day: "numeric",
            }).format(new Date(`${game.datum.split("-").reverse().join("-")}`))}
          </Text>
        </View>

        <View className="items-center justify-center flex-1 w-auto space-y-3">
          <Image
            PlaceholderContent={<ActivityIndicator />}
            placeholderStyle={{ backgroundColor: "#fff" }}
            source={{
              uri:
                "https://vbl.wisseq.eu/vbldataOrganisation/BVBL" +
                game.uit.guid.match(/\d+/g)[0] +
                ".jpg",
              cache: "default",
            }}
            // decode="async"
            contentFit="contain"
            cachePolicy="disk"
            className=" w-11 h-11"
          />
          <Text className=" text-[10px] text-center">{game.uit.naam}</Text>
        </View>
      </View>
      <View className="flex flex-row items-center justify-center mt-2">
        <Text className="text-xs text-gray-500">{game.location}</Text>
      </View>
    </View>
  );
}

export default GameCardComponent;

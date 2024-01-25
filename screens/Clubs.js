// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Icon, Image } from "react-native-elements";

function ClubsScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [recieved, setRecieved] = useState([]);
  const [searchText, setSearchText] = useState("");

  const searchFunction = (text) => {
    setSearchText(text);
    text = text.toLowerCase();
    if (text === "") {
      setData(recieved);
    } else {
      let filteredData = recieved.filter((item) =>
        item.naam.toLowerCase().includes(text)
      );
      setData(filteredData);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Club", {
          guid: item.guid,
        });
      }}
      className="w-full "
    >
      <View className="w-full p-5 my-1 text-sm bg-white rounded-lg items-left">
        {/* <Image
          PlaceholderContent={<ActivityIndicator />}
          placeholderStyle={{ backgroundColor: "#fff" }}
          cachePolicy="memory"
          source={{
            uri:
              "https://vbl.wisseq.eu/vbldataOrganisation/BVBL" +
              item.guid.match(/\d+/g)[0] +
              ".jpg",
          }}
          resizeMode="contain"
          className=" w-11 h-11"
        /> */}
        <Text>{item.naam}</Text>
      </View>
    </TouchableOpacity>
  );

  const getClubs = async () => {
    try {
      const response = await fetch(
        "https://vblCB.wisseq.eu/VBLCB_WebService/data/OrgList?p=1"
      );
      const json = await response.json();
      setRecieved(json);
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClubs();
  }, []);

  return (
    <View className="flex-1 w-full px-3">
      <View className="relative w-full">
        <View className="absolute z-10 flex items-center justify-center top-5 left-5">
          <Icon name="search" type="octicons" className="" />
        </View>
        <TextInput
          placeholderTextColor="black"
          placeholder="Zoek..."
          className="block w-full py-3 pl-12 pr-5 my-2 text-sm bg-white rounded-lg z-9"
          value={searchText}
          onChangeText={(text) => searchFunction(text)}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ guid }) => guid}
          showsVerticalScrollIndicator={false}
          disableVirtualization={true}
          className="w-full mt-2"
          renderItem={renderItem}
        ></FlatList>
      )}
    </View>
  );
}

export default ClubsScreen;

// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { NoDataComponent } from "../components/NoData";

function BugsScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bugs, setBugs] = useState([]);

  const RenderBug = ({ bug }) => {
    return (
      <View className="">
        <View className="p-5 my-1 bg-white rounded-lg items-left">
          {bug.status ? (
            <Text className="mt-1 text-xs italic">{bug.status}</Text>
          ) : null}
          <Text
            className={
              bug.status && bug.status == "Opgelost"
                ? "text-sm font-bold line-through"
                : "text-sm font-bold"
            }
          >
            {bug.title}
          </Text>
          <Text
            className={
              bug.status && bug.status == "Opgelost"
                ? "text-sm line-through"
                : "text-sm"
            }
          >
            {bug.description}
          </Text>
          {bug.temp_solution ? (
            <Text
              className={
                bug.status && bug.status == "Opgelost"
                  ? "mt-1 text-xs italic line-through"
                  : "mt-1 text-xs italic"
              }
            >
              Tijdelijke oplossing: {bug.temp_solution}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  const getBugs = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/Matse2005/Basketbal-Vlaanderen-App/main/bugs.json"
      );
      const json = await response.json();
      setBugs(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBugs();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getBugs();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className="flex-1 px-3">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={bugs}
          extraData={bugs}
          keyExtractor={(bug, index) => index}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NoDataComponent />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          disableVirtualization={true}
          className="mt-2 "
          renderItem={(bug) => <RenderBug bug={bug.item} />}
        ></FlatList>
      )}
    </View>
  );
}

export default BugsScreen;

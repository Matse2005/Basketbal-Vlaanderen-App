// import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  RefreshControl,
  ScrollView,
  Pressable,
} from "react-native";
import GameComponent from "../../components/GameComponent";
import { NoDataComponent } from "../../components/NoData";

function TeamMatchesScreen({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);
  const [matches, setMatches] = useState([]);
  const [prevMatches, setPrevMatches] = useState([]);
  const [prevShown, setShown] = useState(false);
  const { guid } = route.params;
  // const guid = "BVBL1171";

  const getMatches = async () => {
    try {
      const response = await fetch(
        "https://vblcb.wisseq.eu/VBLCB_WebService/data/TeamMatchesByGuid?teamGuid=" +
          guid.replaceAll(" ", "%20")
      );
      const json = await response.json();

      function compareDateTime(a, b) {
        const dateA = new Date(
          `${a.datumString.split("-").reverse().join("-")} ${
            a.beginTijd !== "" ? a.beginTijd.replace(".", ":") : "00:00"
          }`
        );
        const dateB = new Date(
          `${b.datumString.split("-").reverse().join("-")} ${
            b.beginTijd !== "" ? b.beginTijd.replace(".", ":") : "00:00"
          }`
        );

        return dateA - dateB;
      }

      json.sort(compareDateTime);

      setPrevMatches(
        json.filter(
          (item) =>
            new Date(
              item.datumString.split("-").reverse().join("-") +
                " " +
                (item.beginTijd !== ""
                  ? item.beginTijd.replace(".", ":")
                  : "00:00")
            ) < new Date()
        )
      );
      setMatches(
        json.filter(
          (item) =>
            new Date(
              item.datumString.split("-").reverse().join("-") +
                " " +
                (item.beginTijd !== ""
                  ? item.beginTijd.replace(".", ":")
                  : "00:00")
            ) >= new Date()
          // new Date("03-02-2024".split("-").reverse().join("-")).toString()
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getClub = async () => {
    try {
      const response = await fetch(
        "https://vblCB.wisseq.eu/VBLCB_WebService/data/TeamDetailByGuid?teamGuid=" +
          guid.replaceAll(" ", "%20")
      );
      const json = await response.json();
      setData(json);
      getMatches();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrev = () => {
    setShown(true);
  };

  useEffect(() => {
    setTimeout(() => {
      getClub();
    }, 200);
  }, []);

  const onRefresh = React.useCallback(() => {
    setShown(false);
    setRefreshing(true);
    getClub();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className="h-full px-3 ">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {data.map((team) => {
            return (
              <View key={team.guid} className="h-full mt-2">
                <View className="h-full space-y-4">
                  <View className="items-center px-5 py-4 space-y-4 text-center bg-white rounded">
                    {/* <Image
                      PlaceholderContent={<ActivityIndicator />}
                      placeholderStyle={{ backgroundColor: "#fff" }}
                      cachePolicy="memory"
                      source={{
                        uri:
                          "https://vbl.wisseq.eu/vbldataOrganisation/BVBL" +
                          team.guid.match(/\d+/g)[0] +
                          ".jpg",
                      }}
                      resizeMode="contain"
                      className="w-28 h-28"
                    /> */}
                    <Text className="text-lg font-bold text-center text-gray-700">
                      {team.naam}
                    </Text>
                  </View>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    className="space-y-2"
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                  >
                    <Text className="text-lg font-bold">Matchen</Text>
                    <View className="mt-2 mb-8">
                      {prevMatches.length > 0 ? (
                        !prevShown ? (
                          // <Button></Button>
                          <Pressable
                            onPress={loadPrev}
                            // title="Bekijk vorige wedstrijden"
                            // color="#fb923c"

                            className="px-4 py-3 mb-3 bg-orange-400 rounded-lg"
                            // accessibilityLabel="Laad de al gespeelde wedstrijden in"
                          >
                            <Text className="font-semibold text-center text-white">
                              Laad voorbije wedstrijden
                            </Text>
                          </Pressable>
                        ) : (
                          prevMatches.map((item) => (
                            <GameComponent
                              key={item.guid}
                              game={{
                                guid: item.guid,
                                thuis: { guid: item.tTGUID, naam: item.tTNaam },
                                uit: { guid: item.tUGUID, naam: item.tUNaam },
                                datum: item.datumString,
                                tijd: item.beginTijd,
                                poule: item.pouleNaam,
                                uitslag: item.uitslag,
                                location: item.accNaam,
                              }}
                              navigation={navigation}
                            />
                          ))
                        )
                      ) : null}
                      {matches.length > 0 ? (
                        matches.map((item) => (
                          <GameComponent
                            key={item.guid}
                            game={{
                              guid: item.guid,
                              thuis: { guid: item.tTGUID, naam: item.tTNaam },
                              uit: { guid: item.tUGUID, naam: item.tUNaam },
                              datum: item.datumString,
                              tijd: item.beginTijd,
                              poule: item.pouleNaam,
                              uitslag: item.uitslag,
                              location: item.accNaam,
                            }}
                            navigation={navigation}
                          />
                        ))
                      ) : (
                        <View className="flex items-center justify-center rounded-lg">
                          <NoDataComponent />
                        </View>
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default TeamMatchesScreen;

import { useActionSheet } from "@expo/react-native-action-sheet";
import { Platform, Button, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import openMap from "react-native-open-maps";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Linking from "expo-linking";

function GymButton({ address, show = true }) {
  const { showActionSheetWithOptions } = useActionSheet();

  const options =
    Platform.OS == "ios"
      ? ["Google Maps", "Waze", "Apple Maps", "Sluiten"]
      : ["Google Maps", "Waze", "Sluiten"];
  // const destructiveButtonIndex = Platform.OS !== "ios" ? 0 : ;
  const cancelButtonIndex = Platform.OS == "ios" ? 3 : 2;
  const address_string =
    address.street +
    " " +
    address.number +
    "" +
    (address.bus !== null ? address.bus : "") +
    ", " +
    address.postalcode +
    " " +
    address.city +
    " " +
    address.country;

  const onPress = () => {
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        // destructiveButtonIndex,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            openMap({
              provider: "google",
              start: "My Location",
              end: address_string,
            });
            break;
          case 1:
            // openMap({
            //   app: "waze",
            //   start: "My Location",
            //   end: address_string,
            // });
            Platform.OS == "ios"
              ? Linking.canOpenURL("waze://").then((supported) =>
                  supported
                    ? Linking.openURL("waze://?q=" + address_string)
                    : Linking.openURL(
                        "https://apps.apple.com/us/app/id323229106"
                      )
                )
              : Linking.openURL("waze://?q=" + address_string);
            break;
          case cancelButtonIndex:
            // console.log("Cancel");
            break;
          case 2:
            openMap({
              provider: "apple",
              start: "My Location",
              end: address_string,
            });
            break;
        }
      }
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="px-3 py-2 mb-2 bg-white rounded"
    >
      <View className="flex flex-row items-center justify-between ">
        <View className="items-center justify-center w-8 h-8 bg-gray-100 rounded">
          <Text className="items-center justify-center text-lg font-bold text-center text-gray-500">
            <Icon
              name="location"
              type="ionicon"
              className={Platform.OS == "ios" ? "mt-1.5" : "mt-0"}
              color="#6b7280"
              solid={true}
              size={21}
            />
          </Text>
        </View>
        <View>
          <View className="">
            <Text
              className={
                show
                  ? "text-xs text-right text-gray-500"
                  : "text-right text-gray-500"
              }
            >
              {address.name}
            </Text>
            {show ? (
              <View>
                <Text className="text-xs text-right text-gray-500">
                  {address.street} {address.number} {address.bus ?? ""}
                </Text>
                <Text className="text-xs text-right text-gray-500">
                  {address.postalcode} {address.city}
                </Text>
                <Text className="text-xs text-right text-gray-500">
                  {address.country}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export { GymButton };

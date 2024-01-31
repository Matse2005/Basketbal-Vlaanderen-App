import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import "../../Global";

const message = (type, typeCase = "capitilize", length = "short") => {
  switch (type) {
    case "team":
      return length == "long"
        ? (typeCase == "lower" ? "dit" : "Dit") + " " + message(type, "lower")
        : typeCase == "lower"
        ? "team"
        : "Team";
    case "club":
      return length == "long"
        ? (typeCase == "lower" ? "deze" : "Deze") + " " + message(type, "lower")
        : typeCase == "lower"
        ? "club"
        : "Club";
    case "poule":
      return length == "long"
        ? (typeCase == "lower" ? "deze" : "Deze") + " " + message(type, "lower")
        : typeCase == "lower"
        ? "competitie"
        : "Competitie";
  }
};

const formatFavorite = (guid, type) => {
  return type + "_" + guid.replaceAll(" ", "%20");
};

const checkFavorite = async (guid, type) => {
  var favorites = (await getFavorites()) ?? [];
  return favorites.includes(formatFavorite(guid, type));
};

const toggleFavorite = async (guid, type) => {
  if (!(await checkFavorite(guid, type))) await addFavorite(guid, type);
  else await removeFavorite(guid, type);
  global.isUpdated = true;
};

const addFavorite = async (guid, type) => {
  var favorites = (await getFavorites()) ?? [];
  favorites.push(formatFavorite(guid, type));
  storeFavorites(favorites);
  Alert.alert("Favoriete", message(type) + " is toegevoegd aan je favoriete.");
};

const removeFavorite = async (guid, type) => {
  var favorites = (await getFavorites()) ?? [];
  var index = favorites.indexOf(formatFavorite(guid, type));
  if (index !== -1) {
    favorites.splice(index, 1);
  }
  await storeFavorites(favorites);
  Alert.alert("Favoriete", message(type) + " is uit je favoriete gehaald");
};

const storeFavorites = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("favorites", jsonValue);
  } catch (e) {
    console.log(e);
  }
};

const getFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("favorites");
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log(e);
  }
};

export { storeFavorites, getFavorites, checkFavorite, toggleFavorite };

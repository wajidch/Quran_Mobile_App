import AsyncStorage from "@react-native-async-storage/async-storage";
import { IApiSurah } from "../interfaces/allInterfaces";

export const saveToStorage = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};
export const getData = async (key: string): Promise<IApiSurah[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};

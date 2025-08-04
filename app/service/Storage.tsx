import AsyncStorage from "@react-native-async-storage/async-storage";
export const setstorage = async (key: any, val: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(val))
}
export const getStorage = async (key: any) => {
    const res = await AsyncStorage.getItem(key)
    return res ? JSON.parse(res) : null;
}
export const removeStorage = async (key: any) => {
    await AsyncStorage.removeItem(key)
}
export const clearStorage = async () => {
    await AsyncStorage.clear()
}
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorageData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('AsyncStorage: Error saving data:', e);
  }
};

export const getStorageData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('AsyncStorage: Error reading data:', e);
    return null;
  }
};

export const removeStorageData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('AsyncStorage: Error removing data:', e);
  }
};

export const CART_STORAGE_KEY = '@ShopEZ:cart';

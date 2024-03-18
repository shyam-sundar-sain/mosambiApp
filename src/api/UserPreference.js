/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';

// User Preferences Keys
export const async_keys = {
  auth_token: 'auth_token',
  user_id: 'userInfo',
  id: 'id',
  isActive: 'isActive',
  mobile: 'mobile',
  is_register: 'is_register',
  user_detail: 'user_detail',
  active_quiz_id: 'active_quiz_id',
};

// User Preferences Methods
export const storeData = async (key, data) => {
  try {
    const info = JSON.stringify(data);
    await AsyncStorage.setItem(key, info);
  } catch (error) {
    console.log(error.message);
  }
};

export const getData = async key => {
  try {
    const data = await AsyncStorage.getItem(key);
    const info = JSON.parse(data);
    return info;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const clearData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log(error.message);
  }
};

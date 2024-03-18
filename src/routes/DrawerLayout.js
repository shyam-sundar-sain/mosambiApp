/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';
import React, {useContext, useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Text, Alert, TouchableOpacity, Image} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {clearData} from '../api/UserPreference';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//Image...
import logo from '../assets/Image/logo.png';
import AppLoader from '../provider/AppLoader';
import {AuthContext} from '../provider/Context';

// ...

export default function DrawerLayout(props) {
  const {setMainRoute} = useContext(AuthContext);

  const [loader, setLoader] = useState(false);
  const navigation = useNavigation();

  // navigation.dispatch(state => console.log('state-drawer_layout', state));

  const onLogout = async () => {
    try {
      Alert.alert(
        'Logout',
        'Are you sure, you want to logout?',
        [
          {text: 'NO', style: 'cancel'},
          {
            text: 'YES',
            onPress: async () => {
              setLoader(true);
              await clearData();
              setLoader(false);
              setMainRoute('LogoutStack');
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <DrawerContentScrollView {...props}>
      <AppLoader loading={loader} />
      <Image
        source={logo}
        resizeMode="contain"
        style={{
          width: '100%',
          marginBottom: hp(2),
          backgroundColor: '#daf0ff',
        }}
      />
      <DrawerItemList {...props} />
      <TouchableOpacity
        onPress={onLogout}
        style={{marginHorizontal: wp(5), paddingVertical: hp(2)}}>
        <Text
          style={{
            color: '#5c5f5d',
            fontSize: wp(3.8),
            fontWeight: '500',
          }}>
          Logout
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

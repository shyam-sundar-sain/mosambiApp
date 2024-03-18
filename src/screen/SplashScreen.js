/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

//IMAGES
import gif from '../assets/Image/gif.gif';
import logo from '../assets/Image/logo.png';
import {async_keys, getData} from '../api/UserPreference';
import {AuthContext} from '../provider/Context';

const SplashScreen = () => {
  const {setMainRoute} = useContext(AuthContext);

  useEffect(() => {
    const timeOutID = setTimeout(async () => authCheck(), 2000);

    return () => clearTimeout(timeOutID);
  }, []);

  const authCheck = async () => {
    const auth_token = await getData(async_keys.auth_token);

    if (auth_token) {
      setMainRoute('LoginStack');
    } else {
      setMainRoute('LogoutStack');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F2F2F2" barStyle="dark-content" />
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image source={gif} resizeMode="contain" style={styles.gif} />
        <Image source={logo} resizeMode="contain" style={styles.logo} />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gif: {
    height: hp(30),
    aspectRatio: 1 / 1,
    marginBottom: hp(-12),
  },
  logo: {
    width: wp(80),
  },
});

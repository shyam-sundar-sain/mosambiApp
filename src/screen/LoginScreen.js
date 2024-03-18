/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useRef, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import useHardwareBackPress from '../components/useHardwareBackPress';

import Mobilelogin from '../assets/Image/Mobilelogin.png';
import PhoneInput from '../assets/Image/Frame-1.png';
import Password from '../assets/Icon/password.png';
import EmailPhoto from '../assets/Icon/email.png';
import SubmitButton from '../components/SubmitButton';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {async_keys, storeData} from '../api/UserPreference';
import {isEmailAddress} from '../validation/FormValidator';
import DrawerLayout from '../routes/DrawerLayout';
import AppLoader from '../provider/AppLoader';
import {AuthContext} from '../provider/Context';

const LoginScreen = ({navigation}) => {
  const {setMainRoute} = useContext(AuthContext);

  const [loader, setLoader] = useState(false);
  const [mobile, setMobile] = useState('');
  const [tabPosition, setTabPosition] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileError, setMobileError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [passwordError, setPasswordError] = useState(false);
  const scrollViewRef = useRef(null);

  useHardwareBackPress(() => true);

  const handleTabPosition = event => {
    event.persist();
    const pos =
      Math.floor(event.nativeEvent.contentOffset.x) / Math.floor(wp(80)) + 1;

    pos !== tabPosition && setTabPosition(Math.floor(pos));

    handleTabAnimation(Math.floor(pos));
  };

  const mobileTab = () => {
    setTabPosition(1);
    handleTabAnimation(1);

    scrollViewRef.current?.scrollTo({
      x: 0,
      animated: true,
    });
  };

  const emailTab = () => {
    setTabPosition(2);
    handleTabAnimation(2);

    scrollViewRef.current?.scrollTo({
      x: wp(100),
      animated: true,
    });
  };

  const tabBackgroundAnimation = useSharedValue(0); // Initial width of the first tab

  const tabActiveStylez = useAnimatedStyle(() => {
    return {
      transform: [{translateX: tabBackgroundAnimation.value}],
      backgroundColor: '#fff',
      elevation: 3,
    };
  });

  const handleTabAnimation = index => {
    const position = index === 1 ? 0 : wp(41); // Adjust these values based on your tab styles
    tabBackgroundAnimation.value = withTiming(position);
  };

  const handleMobileChange = text => {
    setMobileError(false);
    setMobile(text.replace(/[^0-9]/g, ''));
  };

  const handleEmailChange = text => {
    setEmailError(false);
    setEmail(text);
  };

  const handlePasswordChange = text => {
    setPasswordError(false);
    setPassword(text);
  };

  const handleSubmit = async () => {
    switch (tabPosition) {
      case 1:
        try {
          if (mobile.length < 10) {
            setMobileError(true);
            return false;
          }
          setLoader(true);
          const response = await makeRequest(
            `check-number`,
            {number: mobile},
            true,
          );

          if (response) {
            const {Status, message} = response;
            if (Status === true) {
              const {Data} = response;
              const {isRegistred, otp} = Data;

              if (isRegistred === true) {
                navigation.navigate('LoginWithPassword', {mobNum: mobile});
              } else if (isRegistred === false) {
                navigation.navigate('OtpVerification', {mobNum: mobile});
              } else {
                setMobileError(true);
              }
            }
          }
          setLoader(false);
        } catch (error) {
          setLoader(false);
          console.log(error.message);
        }

        break;

      case 2:
        try {
          if (!isEmailAddress(email)) {
            setEmailError(true);
            return false;
          }
          // preparing params
          const params = {email, password: password};

          setLoader(true);
          // calling api
          const response = await makeRequest('login', params, true);

          if (response) {
            const {Status, message, Token, Data} = response;

            if (Status === true) {
              await storeData(async_keys.auth_token, Token);
              await storeData(async_keys.user_detail, Data);

              ToastAndroid.showWithGravity(
                message,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );

              setMainRoute('LoginStack');
            } else {
              ToastAndroid.showWithGravity(
                message,
                ToastAndroid.LONG,
                ToastAndroid.TOP,
              );
              // setPasswordError(true);
            }
          }
          setLoader(false);
        } catch (error) {
          setLoader(false);
          console.log(error.message);
        }
        break;

      default:
        break;
    }
  };

  // const handleSubmit = () => {
  //   navigation.navigate('RegisterScreen');
  // };

  return (
    <KeyboardAwareScrollView
      // keyboardShouldPersistTaps="handled"
      style={styles.container}>
      <AppLoader loading={loader} />
      <Image
        source={Mobilelogin}
        resizeMode="contain"
        style={styles.mobileLogin}
      />

      <Text
        style={{
          alignSelf: 'center',
          marginTop: hp(3),
          fontSize: wp(5),
          color: '#595959',
        }}>
        Welcome to{' '}
        <Text style={{color: '#E03456', fontSize: wp(8)}}>Mosambi</Text>
      </Text>

      <View style={{marginTop: hp(3), paddingHorizontal: hp(4)}}>
        <Text style={{color: '#000', fontSize: wp(5), fontWeight: '500'}}>
          Login Account
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginTop: hp(5),
            backgroundColor: '#EDEDED',
            height: hp(8),
            padding: hp(1),
            justifyContent: 'space-between',
            borderRadius: wp(3),
          }}>
          <View
            style={{
              position: 'absolute',
              height: '95%',
              width: wp(80),
              alignSelf: 'center',
              marginHorizontal: '3%',
            }}>
            <Animated.View
              style={[
                {
                  width: wp(38),
                  height: '100%',
                  borderRadius: wp(3),
                },
                tabActiveStylez,
              ]}
            />
          </View>

          <TouchableOpacity
            activeOpacity={1}
            onPress={mobileTab}
            style={{
              width: wp(38),
              borderRadius: wp(3),
              justifyContent: 'center',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontWeight: '500',
                color: '#000',
              }}>
              Phone Number
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={emailTab}
            style={{
              width: wp(38),
              borderRadius: wp(3),
              justifyContent: 'center',
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontWeight: '500',
                color: '#000',
              }}>
              Email
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onMomentumScrollEnd={handleTabPosition}>
          <View
            style={{
              marginTop: hp(2),
              width: wp(84.2),
            }}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: wp(0.2),
                borderBottomColor: '#979797',
              }}>
              <Image
                source={PhoneInput}
                resizeMode="center"
                style={styles.phoneInputImage}
              />
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#595959"
                keyboardType="numeric"
                maxLength={10}
                style={styles.phoneInput}
                value={mobile}
                onChangeText={handleMobileChange}
              />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  color: '#D70000',
                  fontSize: wp(3),
                  fontWeight: '500',
                  top: 10,
                }}>
                {mobileError ? `Invalid or Incorrect Number. Try Again!` : ''}
              </Text>
              {/* <TouchableOpacity onPress={handleForget}>
                <Text
                  style={{
                    color: '#D70000',
                    fontSize: wp(3),
                    fontWeight: '500',
                    top: 10,
                  }}>
                  Forget Password?
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>

          <View
            style={{
              marginTop: hp(2),
              width: wp(84.2),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                borderBottomWidth: wp(0.2),
                borderBottomColor: '#979797',
              }}>
              <Image
                source={EmailPhoto}
                resizeMode="center"
                style={styles.phoneInputImage}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#595959"
                keyboardType="ascii-capable"
                // maxLength={10}
                style={styles.phoneInput}
                value={email}
                onChangeText={handleEmailChange}
              />
            </View>

            <Text
              style={{
                color: '#D70000',
                fontSize: wp(3),
                fontWeight: '500',
                top: 10,
              }}>
              {emailError ? `Invalid or Incorrect Email. Try Again!` : ''}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                borderBottomWidth: wp(0.2),
                borderBottomColor: '#979797',
                marginTop: hp(2),
              }}>
              <Image
                source={Password}
                resizeMode="center"
                style={styles.phoneInputImage}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#595959"
                maxLength={10}
                style={styles.phoneInput}
                value={password}
                onChangeText={handlePasswordChange}
              />
            </View>

            <Text
              style={{
                color: '#D70000',
                fontSize: wp(3),
                fontWeight: '500',
                // top: 10,
                marginTop: 5,
              }}>
              {passwordError ? `Invalid or Incorrect Password. Try Again!` : ''}
            </Text>
          </View>
        </ScrollView>

        <SubmitButton
          title="Continue"
          onPress={handleSubmit}
          style={{
            marginTop: hp(3),
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mobileLogin: {
    height: hp(30),
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    marginTop: hp(6),
  },
  phoneInput: {
    flex: 1,
    marginLeft: wp(5),
    color: '#000',
  },
  phoneInputImage: {
    alignSelf: 'center',
    height: hp(3),
    width: hp(3),
  },
});

/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AuthHeader from '../components/AuthHeader';

import Mobilelogin from '../assets/Image/Mobilelogin.png';
import Password from '../assets/Icon/password.png';
import EmailPhoto from '../assets/Icon/email.png';
import SubmitButton from '../components/SubmitButton';

const LoginWithEmail = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = text => {
    setEmail(text);
  };

  const handlePasswordChange = text => {
    setPassword(text);
  };

  return (
    <View style={styles.container}>
      {/* <AuthHeader title="OTP Verification" /> */}
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
      <View style={{marginTop: hp(3)}}>
        <Text style={{color: '#000', fontSize: wp(5), fontWeight: '500'}}>
          Login Account
        </Text>

        <View
          style={{
            // flex: 1,
            flexDirection: 'row',
            marginTop: hp(5),
            backgroundColor: '#EDEDED',
            height: hp(8),
            padding: hp(1),
            justifyContent: 'space-between',
            // alignItems: 'center',
            borderRadius: wp(3),
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
            style={{
              // backgroundColor: '#fff',
              // flex: 1,
              width: wp(38),
              borderRadius: wp(3),
              justifyContent: 'center',
              // elevation: 3,
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontWeight: '500',
                color: '#000',
                // marginVertical: hp(1),
                // marginHorizontal: hp(5),
              }}>
              Phone Number
            </Text>
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: '#fff',
              // flex: 1,
              width: wp(38),
              borderRadius: wp(3),
              justifyContent: 'center',
              elevation: 3,
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontWeight: '500',
                color: '#000',
                // marginVertical: hp(1.5),
                // marginHorizontal: hp(5),
              }}>
              Email
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContentL: 'center',
            borderBottomWidth: wp(0.2),
            borderBottomColor: '#979797',
            marginTop: hp(4),
          }}>
          <Image
            source={EmailPhoto}
            resizeMode="center"
            style={styles.phoneInputImage}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#595959"
            keyboardType="numeric"
            maxLength={10}
            style={styles.phoneInput}
            value={email}
            onChangeText={handleEmailChange}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContentL: 'center',
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

        <SubmitButton
          title="Continue"
          style={{
            marginTop: hp(5),
          }}
        />
      </View>
    </View>
  );
};

export default LoginWithEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // marginHorizontal: hp(4),
    // marginHorizontal: wp(5),
  },
  mobileLogin: {
    height: hp(25),
    aspectRatio: 1 / 1,
    alignSelf: 'center',
    marginTop: hp(2),
  },
  phoneInput: {
    flex: 1,
    marginLeft: wp(5),
  },
  phoneInputImage: {
    alignSelf: 'center',
    height: hp(3),
    width: hp(3),
    // aspectRatio: 1 / 1,
  },
});

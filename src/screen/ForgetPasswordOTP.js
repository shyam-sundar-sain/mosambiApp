/* eslint-disable react-native/no-inline-styles */
import {
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AuthHeader from '../components/AuthHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OtpScreenImage from '../assets/svg-Images/OtpScreenImage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import OTPInput from '../../otpInput/OTPInput';
import SubmitButton from '../components/SubmitButton';
import {makeRequest} from '../api/ApiInfo';
import AppLoader from '../provider/AppLoader';

const ForgetPasswordOTP = ({navigation, route}) => {
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    let interval;

    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const submit = () => {
    if (otp.length < 4) {
      setOtpError(true);
      return false;
    }

    const number = route.params.mobile;

    setLoader(true);
    makeRequest('match-otp', {number, otp}, true)
      .then(result => {
        const {Status, message} = result;
        if (message !== 'otp not match') {
          navigation.navigate('ForgetCreatePassword', {number});
        }
        setLoader(false);
        ToastAndroid.showWithGravity(
          message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      })
      .catch(e => {
        setLoader(false);
        console.log('match-otp', e);
      });
  };

  const handleResend = async () => {
    const number = route.params.mobile;

    setCountdown(120);

    try {
      setLoader(true);
      makeRequest('verify-number', {number}, true)
        .then(result => {
          const {Status, message} = result;
          if (Status === true) {
            setLoader(false);
            ToastAndroid.showWithGravity(
              message,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
          }
        })
        .catch(e => setLoader(false));
    } catch (error) {
      setLoader(false);
      console.log('verify-number', error);
    }
  };

  return (
    <View style={styles.container}>
      <AppLoader loading={loader} />
      <AuthHeader title="Forget Password" />

      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled">
        {/* <View style={{alignItems: 'center'}}>
            <OtpScreenImage />
          </View> */}

        <Text
          style={{
            fontWeight: '700',
            fontSize: wp(5),
            color: '#000',
            marginHorizontal: wp(8),
            marginTop: hp(6),
            marginBottom: hp(1),
          }}>
          Let's verify your number
        </Text>

        <Text
          style={{
            marginHorizontal: wp(8),
            color: '#000',
            fontWeight: '700',
            fontSize: wp(4),
          }}>
          {route?.params?.mobile}
        </Text>

        <View style={styles.otpContainer}>
          <OTPInput
            code={otp}
            setCode={setOtp}
            maximumLength={4}
            setOtpError={setOtpError}
          />
        </View>

        <Text
          style={{
            color: '#D70000',
            fontSize: wp(3),
            fontWeight: '500',
            marginHorizontal: wp(8),
          }}>
          {otpError ? `Invalid or Incorrect OTP. Try Again!` : ''}
        </Text>

        <SubmitButton
          onPress={submit}
          title="Verify"
          style={{
            marginTop: hp(5),
            marginBottom: hp(3),
            marginHorizontal: wp(5),
          }}
        />

        {countdown > 0 ? (
          <Text
            style={{
              alignSelf: 'center',
              marginHorizontal: wp(5),
              color: 'red',
              fontWeight: '600',
              fontSize: wp(4),
            }}>
            {formatTime(countdown)}
          </Text>
        ) : null}

        {countdown === 0 && (
          <TouchableOpacity onPress={handleResend}>
            <Text
              style={{
                alignSelf: 'center',
                color: '#000',
                fontWeight: '600',
                fontSize: wp(4),
              }}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ForgetPasswordOTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  otpContainer: {
    height: hp(8),
    width: '72%',
    marginVertical: hp(2),
    marginHorizontal: wp(8),
    marginTop: hp(4),
  },
  button: {
    marginTop: hp(5),
    paddingVertical: hp(2),
    backgroundColor: '#E03456',
    borderRadius: wp(4),
    marginHorizontal: wp(5),
    marginBottom: hp(3),
  },
});

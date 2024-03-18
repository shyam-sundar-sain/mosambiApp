/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AuthHeader from '../components/AuthHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OtpScreenImage from '../assets/svg-Images/OtpScreenImage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TextInput} from 'react-native-paper';
import {CheckBox, Icon} from '@rneui/themed';
import SubmitButton from '../components/SubmitButton';
import {makeRequest} from '../api/ApiInfo';
import AppLoader from '../provider/AppLoader';

const ForgetPassword = ({navigation, route}) => {
  const [mobile, setMobile] = useState(route?.params?.mobNum);
  const [mobileError, setMobileError] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleMobileChange = text => {
    setMobileError(false);
    setMobile(text.replace(/[^0-9]/g, ''));
  };

  //   const submit = () => {
  //     navigation.navigate('ForgetPasswordOTP');
  //   };

  const submit = async () => {
    try {
      if (mobile.length < 10) {
        setMobileError(true);
        return false;
      }
      setLoader(true);
      makeRequest('verify-number', {number: mobile}, true)
        .then(result => {
          const {Status, message} = result;
          if (Status === true) {
            navigation.navigate('ForgetPasswordOTP', {mobile});
          }
          setLoader(false);
          ToastAndroid.showWithGravity(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
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
        <View style={{alignItems: 'center'}}>
          <OtpScreenImage />
        </View>

        <Text
          style={{
            fontWeight: '700',
            fontSize: wp(5),
            color: '#000',
            marginHorizontal: wp(8),
            marginTop: hp(6),
            marginBottom: hp(1),
          }}>
          Phone Number
        </Text>

        <Text style={{marginHorizontal: wp(8), color: '#000'}}>
          Enter register number
        </Text>

        <View style={styles.otpContainer}>
          <TextInput
            editable={false}
            mode="flat"
            // label="Mobile"
            placeholder="Phone Number"
            value={mobile}
            textColor="#000"
            keyboardType="numeric"
            underlineColor="#555"
            activeUnderlineColor="#E03456"
            style={styles.inputContainer}
            onChangeText={handleMobileChange}
            left={
              <TextInput.Icon
                style={{alignSelf: 'flex-end'}}
                icon={({iconColor}) => (
                  <Icon
                    color="#595959"
                    size={wp(7)}
                    type="font-awesome"
                    name="mobile-phone"
                  />
                )}
              />
            }
          />
        </View>

        <Text
          style={{
            color: '#D70000',
            fontSize: wp(3),
            fontWeight: '500',
            marginHorizontal: wp(8),
          }}>
          {mobileError ? `Invalid or Incorrect Number. Try Again!` : ''}
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
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    backgroundColor: 'transparent',
    marginHorizontal: wp(8),
    marginTop: hp(4),
  },
  //   otpContainer: {
  //     marginTop: hp(4),
  //   },
});

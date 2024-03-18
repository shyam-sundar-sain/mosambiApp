import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import AuthHeader from '../components/AuthHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput} from 'react-native-paper';
import {Icon} from '@rneui/themed';
import SubmitButton from '../components/SubmitButton';
import AppLoader from '../provider/AppLoader';
import {async_keys, storeData} from '../api/UserPreference';
import {makeRequest} from '../api/ApiInfo';

const CreatePassword = ({navigation, route}) => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [referal, setReferal] = useState('');
  const [secure, setSecure] = useState({
    password: true,
    confirmPassword: true,
  });
  const [inputs, setInputs] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleInputs = (key, val) => {
    setError(false);
    setInputs({...inputs, [key]: val});
  };

  const handleReferalChange = text => {
    setError(false);
    setReferal(text);
  };

  const handleSubmit = () => {
    const {password, confirmPassword} = inputs;
    if (password.trim() === '') {
      setError(true);
      return false;
    }
    if (password !== confirmPassword) {
      alert('Pasword does not match!');
      return false;
    }

    let params = route?.params?.params;
    params.password = password;

    if (referal !== '') {
      params.from_referal = referal;
    }

    // console.log('pr', params);

    setLoader(true);
    makeRequest('signup', params, true)
      .then(async result => {
        await storeData(async_keys.user_detail, result.Data);
        setLoader(false);
        navigation.navigate('LoginScreen');
      })
      .catch(e => {
        setLoader(false);
        console.log('error', e);
      });
  };

  return (
    <View style={styles.container}>
      <AppLoader loading={loader} />

      <AuthHeader title="CreateAccount" />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={{
          marginTop: hp(10),
        }}>
        <TextInput
          secureTextEntry={secure.password}
          onChangeText={text => handleInputs('password', text)}
          mode="flat"
          // label=" Password"
          placeholder="Password"
          placeholderTextColor="#595959"
          textColor="#000"
          underlineColor="#555"
          activeUnderlineColor="#E03456"
          style={styles.inputContainer}
          left={
            <TextInput.Icon
              icon={({iconColor}) => (
                <Icon size={wp(7)} type="evilicon" name="lock" />
              )}
            />
          }
          right={
            <TextInput.Icon
              onPress={() => setSecure({...secure, password: !secure.password})}
              icon={secure.password ? 'eye-off-outline' : 'eye-outline'}
            />
          }
        />

        <Text
          style={{
            color: '#D70000',
            fontSize: wp(3),
            fontWeight: '500',
            top: 5,
            marginHorizontal: wp(5),
          }}>
          {error ? `Please enter your password!` : ''}
        </Text>

        <TextInput
          secureTextEntry={secure.confirmPassword}
          onChangeText={text => handleInputs('confirmPassword', text)}
          mode="flat"
          // label="Confirm password"
          placeholder="Confirm password"
          placeholderTextColor="#595959"
          textColor="#000"
          underlineColor="#555"
          activeUnderlineColor="#E03456"
          style={styles.inputContainer}
          left={
            <TextInput.Icon
              icon={({iconColor}) => (
                <Icon size={wp(7)} type="evilicon" name="lock" />
              )}
            />
          }
          right={
            <TextInput.Icon
              onPress={() =>
                setSecure({...secure, confirmPassword: !secure.confirmPassword})
              }
              icon={secure.confirmPassword ? 'eye-off-outline' : 'eye-outline'}
            />
          }
        />

        <TextInput
          onChangeText={text => handleReferalChange(text)}
          mode="flat"
          placeholder="Referal code (optional)"
          placeholderTextColor="#595959"
          textColor="#000"
          underlineColor="#555"
          activeUnderlineColor="#E03456"
          style={[styles.inputContainer, {marginTop: hp(2)}]}
          left={
            <TextInput.Icon
              icon={({iconColor}) => (
                <Icon
                  color="#595959"
                  size={wp(5)}
                  type="font-awesome"
                  name="user-o"
                />
              )}
            />
          }
        />

        <SubmitButton
          title="Continue"
          onPress={handleSubmit}
          style={{
            marginTop: hp(8),
            marginHorizontal: wp(5),
          }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default CreatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: 'transparent',
    marginHorizontal: wp(5),
    color: '#000',
  },
});

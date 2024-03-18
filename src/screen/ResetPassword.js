/* eslint-disable curly */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dropdown} from 'react-native-element-dropdown';
import SubmitButton from '../components/SubmitButton';
import MainHeader from '../components/MainHeader';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {async_keys, storeData} from '../api/UserPreference';
import AppLoader from '../provider/AppLoader';
import {utility} from '../provider/Util';

const ResetPassword = () => {
  const [loader, setLoader] = useState(false);

  const [isFocus, setIsFocus] = useState(false);
  const onMenuPress = () => {};

  useEffect(() => {
    getState();
    // getCity();
    // getDetail();
  }, []);

  const getState = async () => {
    setLoader(true);
    try {
      const response = await makeRequest('get-state');

      if (response) {
        const {Status, Data} = response;

        if (Status === true) {
          setState(Data);
        }
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error.message);
    }
  };

  const handleSubmit = async () => {
    // try {
    //   // setShowProcessingLoader(true);
    //   const params = {
    //     state: selectedState,
    //     city: selectedCity,
    //     blood_group: bloodGroup.filter(item => item.selected)[0].id,
    //   };
    //   // calling api
    //   const response = await makeRequest('get-blood-requester', params, true);
    //   if (response) {
    //     const {Status, message} = response;
    //     if (Status === true) {
    //       const {Data} = response;
    //       setDonorList(Data);
    //     }
    //   }
    // } catch (error) {
    //   console.log(error.message);
    // }
  };

  const handleRequest = async item => {
    if (!item?.userId) false;

    setLoader(true);
    makeRequest('blood-request', {id: item?.userId}, true)
      .then(result => {
        const {Status, message} = result;
        if (Status === true) {
          setDonorList(
            donorList.map(i => {
              if (i.id === item.id) {
                return {...i, requested: !i.requested};
              }
              return i;
            }),
          );
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
        console.log('blood-request', e);
      });
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF6382" barStyle="light-content" />

      <AppLoader loading={loader} />

      <MainHeader title="Reset" height={'36%'} onMenuPress={onMenuPress} />

      <View style={{flex: 1.8, marginTop: hp(10)}}>
        <View
          style={{
            backgroundColor: '#fff',
            elevation: 5,
            borderRadius: wp(5),
            padding: wp(5),
            //   marginTop: hp(-25),
            marginHorizontal: wp(5),
          }}>
          <Text
            style={{
              fontSize: wp(6),
              color: '#000',
              fontWeight: '500',
            }}>
            Reset
          </Text>

          <View
            style={[
              {
                marginVertical: hp(1),
                zIndex: 999,
              },
            ]}>
            <SubmitButton title="Continue" onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: hp(2),
    borderRadius: wp(4),
  },
  selectedTextStyle: {
    color: '#000',
  },
});

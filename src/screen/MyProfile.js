/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import React, {useEffect, useState, useContext} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
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
import FindDonorImage from '../assets/svg-Images/FindDonorImage';
import MainHeader from '../components/MainHeader';
import AppLoader from '../provider/AppLoader';

import ic_edit from '../assets/Icon/edit.png';
import ProfilePhoto from '../assets/Image/ProfilePhoto.png';
import FindDonorListIcon from '../assets/svg-Images/FindDonorListIcon';
import FindDonorListIconSent from '../assets/svg-Images/FindDonorListIconSent';
import {async_keys, getData, clearData} from '../api/UserPreference';
import {utility} from '../provider/Util';
import {AuthContext} from '../provider/Context';
import {makeRequest} from '../api/ApiInfo';
import {useIsFocused} from '@react-navigation/native';

const MyProfile = ({navigation}) => {
  const [profile, setProfile] = useState({});
  const [loader, setLoader] = useState(false);
  const {setMainRoute} = useContext(AuthContext);

  const focus = useIsFocused();

  useEffect(() => {
    if (focus) {
      getData(async_keys.user_detail)
        .then(detail => setProfile(detail))
        .catch(e => console.log(e));
    }
  }, [focus]);

  const onMenuPress = () => {};

  const handleUpdate = () => {
    navigation.navigate('UpdateProfile');
  };

  const handleDelete = async () => {
    try {
      Alert.alert(
        'Alert',
        'Are you sure, you want to delete your account?',
        [
          {text: 'NO', style: 'cancel'},
          {
            text: 'YES',
            onPress: async () => {
              const response = await makeRequest(
                'delete-my-account',
                null,
                true,
              );
              if (response) {
                const {Status, message} = response;
                console.log('rp', response);
                if (Status === true) {
                  setLoader(true);
                  await clearData();
                  setLoader(false);
                  setMainRoute('LogoutStack');
                }
              }
              setLoader(false);
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    } catch (error) {
      setLoader(false);
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <AppLoader loading={loader} />
      <StatusBar backgroundColor="#FF6382" barStyle="light-content" />

      <MainHeader title="My Profile" height={'36%'} />

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
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <LinearGradient
              colors={['#FF6382', '#E03456']}
              style={{
                height: hp(8),
                aspectRatio: 1 / 1,
                borderRadius: wp(100),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: wp(5),
                  fontWeight: '500',
                  alignSelf: 'center',
                }}>
                {utility.getBloodByID(profile?.blood_group || '')}
              </Text>
            </LinearGradient>
            <TouchableOpacity onPress={handleUpdate}>
              <Image
                source={ic_edit}
                //   resizeMode="center"
                style={{height: hp(3), width: wp(6)}}
              />
            </TouchableOpacity>
          </View>
          <Image
            source={ProfilePhoto}
            //   resizeMode="center"
            style={{height: hp(20), aspectRatio: 1 / 1, alignSelf: 'center'}}
          />
          <Text
            style={{
              color: '#595959',
              fontSize: wp(4),
              fontWeight: '500',
              borderBottomWidth: wp(0.4),
              borderBottomColor: '#595959',
              marginTop: hp(2),
              marginHorizontal: wp(4),
              paddingBottom: hp(1),
              textTransform: 'capitalize',
            }}>
            {profile?.name}
          </Text>
          <Text
            style={{
              color: '#595959',
              fontSize: wp(4),
              fontWeight: '500',
              borderBottomWidth: wp(0.4),
              borderBottomColor: '#595959',
              marginTop: hp(2),
              marginHorizontal: wp(4),
              paddingBottom: hp(1),
            }}>
            {profile?.email}
          </Text>
          <Text
            style={{
              color: '#595959',
              fontSize: wp(4),
              fontWeight: '500',
              borderBottomWidth: wp(0.4),
              borderBottomColor: '#595959',
              marginTop: hp(2),
              marginHorizontal: wp(4),
              paddingBottom: hp(1),
            }}>
            {profile?.number}
          </Text>
          <Text
            style={{
              color: '#595959',
              fontSize: wp(4),
              fontWeight: '500',
              borderBottomWidth: wp(0.4),
              borderBottomColor: '#595959',
              marginTop: hp(2),
              marginHorizontal: wp(4),
              paddingBottom: hp(1),
            }}>
            {utility.getBloodByID(profile?.blood_group || '')}
          </Text>
          <Text
            style={{
              color: '#595959',
              fontSize: wp(4),
              fontWeight: '500',
              borderBottomWidth: wp(0.4),
              borderBottomColor: '#595959',
              marginTop: hp(2),
              marginHorizontal: wp(4),
              paddingBottom: hp(1),
            }}>
            {profile?.dob}
          </Text>
          <Text
            style={{
              color: '#595959',
              fontSize: wp(4),
              fontWeight: '500',
              borderBottomWidth: wp(0.4),
              borderBottomColor: '#595959',
              marginTop: hp(2),
              marginHorizontal: wp(4),
              paddingBottom: hp(1),
            }}>
            {profile?.city}, {profile?.state}
          </Text>

          <SubmitButton
            title="Delete My Account"
            onPress={handleDelete}
            style={{
              marginTop: hp(3),
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: hp(2),
    borderRadius: wp(4),
  },
});

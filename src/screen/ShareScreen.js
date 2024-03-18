/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import MainHeader from '../components/MainHeader';
import LinearGradient from 'react-native-linear-gradient';
import SubmitButton from '../components/SubmitButton';

//Image & Icons...
import ic_home_menu from '../assets/Icon/home_menu.png';
import ic_notification from '../assets/Icon/notification.png';
import mosambi from '../assets/Image/mosambi.png';
import {async_keys, getData} from '../api/UserPreference';

const Header = ({navigation, profileDetails}) => (
  <View
    style={{
      paddingVertical: hp(2),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={{
          marginLeft: wp(3),
          padding: wp(1.5),
          paddingHorizontal: wp(2),
        }}>
        <Image source={ic_home_menu} style={{height: wp(8), width: wp(8)}} />
      </TouchableOpacity>
      <Text
        style={{
          color: '#000',
          fontSize: wp(5),
          fontWeight: '700',
          marginLeft: wp(3),
          alignSelf: 'center',
        }}>
        Share
      </Text>
    </View>

    <TouchableOpacity
      onPress={() => alert('Coming Soon')}
      style={{
        marginRight: wp(3),
        padding: wp(1.5),
        paddingHorizontal: wp(2),
      }}>
      <Image source={ic_notification} style={{width: wp(6), height: wp(6)}} />
    </TouchableOpacity>
  </View>
);

const ShareScreen = () => {
  const [profileDetails, setProfileDetails] = useState({});

  useEffect(() => {
    initializeHome();
  }, []);

  const initializeHome = () => {
    getData(async_keys.user_detail)
      .then(details => {
        setProfileDetails(details);
      })
      .catch(e => console.log(e));
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Hi, This is Mosambi app to donate blood and you can play game also. I will give you My Referral code to earn extra mosambi' +
          '\n' +
          '\n' +
          'This is my code -->' +
          ' ' +
          profileDetails.referal_code +
          '\n' +
          '\n' +
          'https://play.google.com/store/apps/details?id=com.ecommerce.mosambi&pcampaignid=web_share',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Header /> */}
      <MainHeader title="Share" />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: wp(4),
          }}>
          <Image
            source={mosambi}
            resizeMode="center"
            style={{
              alignSelf: 'center',
              height: hp(25),
              aspectRatio: 1 / 1,
              marginBottom: hp(3),
            }}
          />

          <Text
            style={{
              color: '#000',
              fontSize: wp(4.4),
              fontWeight: '700',
              textAlign: 'center',
            }}>
            Hi, This is Mosambi app to donate blood and you can play game also.
            I will give you My Referral code to earn extra mosambi
          </Text>

          <LinearGradient
            colors={['#FF6382', '#E03456']}
            style={{
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: hp(4),
              marginVertical: hp(3),
            }}>
            <Text
              style={{
                color: '#fff',
                fontWeight: '900',
                fontSize: wp(5),
                textAlign: 'center',
              }}>
              {profileDetails.referal_code}
            </Text>
          </LinearGradient>

          <Text
            style={{
              color: '#000',
              fontSize: wp(4.4),
              fontWeight: '700',
              textAlign: 'center',
            }}>
            This is My Code
          </Text>
        </View>
        <SubmitButton
          title="Share"
          onPress={onShare}
          style={{
            marginTop: hp(3),
            marginHorizontal: wp(4),
          }}
        />
      </View>
    </View>
  );
};

export default ShareScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

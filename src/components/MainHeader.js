/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ic_menu from '../assets/Icon/menu.png';
import {useNavigation} from '@react-navigation/native';

const MainHeader = ({title, height = null}) => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={['#FF6382', '#E03456']}
      style={{
        zIndex: -999,
        position: 'absolute',
        width: '100%',
        height: height,
      }}>
      <View
        style={{
          paddingVertical: hp(2),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{
            marginLeft: wp(3),
            padding: wp(1.5),
            paddingHorizontal: wp(2),
            zIndex: 999,
          }}>
          <Image source={ic_menu} style={{height: wp(6), width: wp(6)}} />
        </TouchableOpacity>

        <View
          style={{
            position: 'absolute',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}>
          <Text style={{fontWeight: '500', color: '#fff', fontSize: wp(4.5)}}>
            {title}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default MainHeader;

const styles = StyleSheet.create({});

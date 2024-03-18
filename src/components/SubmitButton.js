/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SubmitButton = ({title, onPress, style, containerStyle, titleStyle}) => {
  return (
    <LinearGradient
      colors={['#FF6382', '#E03456']}
      style={[
        {
          marginTop: hp(2),
          borderRadius: wp(4),
        },
        style,
      ]}>
      <TouchableOpacity
        onPress={onPress}
        style={[{paddingVertical: hp(2), borderRadius: wp(4)}, containerStyle]}>
        <Text
          style={[
            {
              alignSelf: 'center',
              justifyContent: 'center',
              color: '#fff',
            },
            titleStyle,
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({});

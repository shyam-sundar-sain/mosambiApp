import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Icon} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';

const AuthHeader = ({title, backDisable}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Icon
        disabled={backDisable}
        onPress={() => {
          navigation.goBack();
        }}
        activeOpacity={1}
        type="octicon"
        name="arrow-left"
        containerStyle={[styles.backIconContainer, backDisable && {opacity: 0}]}
      />
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
  },
  backIconContainer: {
    marginLeft: wp(5),
    padding: 5,
    paddingHorizontal: 10,
  },
  titleText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    zIndex: -999,
    fontWeight: '600',
    color: '#000',
    fontSize: wp(4),
  },
});

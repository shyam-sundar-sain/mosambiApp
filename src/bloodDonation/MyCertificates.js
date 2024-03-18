/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AuthHeader from '../components/AuthHeader';
import {makeRequest} from '../api/ApiInfo';

const MyCertificates = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    makeRequest(`get-certificate`)
      .then(result => {
        const {Status} = result;
        if (Status === true) {
          const {Data} = result;
          setData(Data);
        }
        setLoader(false);
      })
      .catch(e => {
        setLoader(false);
        console.log(e);
      });
  }, []);

  return (
    <View style={{flex: 1}}>
      <AuthHeader title="My Certificates" />

      <FlatList
        data={data}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.view}
            // onPress={this.handleViewCertificate}
          >
            {item?.certificate && (
              <Image
                source={{uri: item?.certificate}}
                resizeMode="cover"
                style={styles.certificateImageStyle}
              />
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={{paddingTop: hp(3), paddingBottom: hp(5)}}
      />
    </View>
  );
};

export default MyCertificates;

const styles = StyleSheet.create({
  view: {
    borderRadius: wp(2),
    borderColor: '#ccc',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 10,
    // padding: 10,
    borderWidth: 1,
    margin: wp(2),
    height: hp(32),
    aspectRatio: 15 / 11,
  },
  certificateImageStyle: {
    // width: 'auto',
    height: hp(28),
    aspectRatio: 16 / 11,
    // elevation: 20,
  },
});

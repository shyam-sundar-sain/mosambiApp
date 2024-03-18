/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthHeader from '../components/AuthHeader';

import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FindDonorImage from '../assets/svg-Images/FindDonorImage';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {async_keys, storeData} from '../api/UserPreference';
import {utility} from '../provider/Util';
import AppLoader from '../provider/AppLoader';
import {Icon} from '@rneui/themed';
import Feather from 'react-native-vector-icons/Feather';

const RequestHistory = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [donorList, setDonorList] = useState([]);
  // console.log('List', donorList);

  useEffect(() => {
    fetchRequest();
  }, []);

  const fetchRequest = () => {
    setLoader(true);
    makeRequest('my-request')
      .then(result => {
        setDonorList(result.Data || []);
        setLoader(false);
      })
      .catch(e => {
        setLoader(false);
        console.log('my-request', e);
      });
  };

  const handleStatus = async (status, id) => {
    try {
      setLoader(true);

      const params = {
        status,
        id,
      };

      const response = await makeRequest('change-request-status', params, true);

      if (response) {
        const {Status, message, Data} = response;

        if (Status === true) {
          setDonorList(prevList => {
            const updatedList = prevList.map(item =>
              item.id === id ? {...item, recive_status: status} : item,
            );
            return updatedList;
          });
        } else {
          console.log(message);
        }
      }

      setLoader(false);
    } catch (error) {
      console.log(error.message);
      setLoader(false);
    }
  };

  console.log('donorList', donorList);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF6382" barStyle="light-content" />
      <AppLoader loading={loader} />
      <AuthHeader title="Request History" />

      <View style={{flex: 1.8}}>
        <FlatList
          keyExtractor={item => item?.id?.toString()}
          data={donorList}
          ListEmptyComponent={() => (
            <View style={{alignItems: 'center'}}>
              <Text
                style={{
                  color: '#000',
                  alignSelf: 'center',
                  fontWeight: '900',
                  fontSize: wp(5),
                }}>
                No data found!
              </Text>
              <FindDonorImage />
            </View>
          )}
          renderItem={({item, status}) => (
            <View
              style={{
                backgroundColor: '#fff',
                elevation: 5,
                borderRadius: wp(3),
                flexDirection: 'row',
                marginHorizontal: wp(5),
                marginLeft: wp(13),
                // marginTop: hp(-1),
                marginVertical: hp(3),
                alignItems: 'center',
              }}>
              <LinearGradient
                colors={['#FF6382', '#E03456']}
                style={{
                  borderRadius: wp(3),
                  paddingHorizontal: hp(2.5),
                  paddingVertical: hp(2.5),
                  top: hp(-3),
                  left: wp(-8),
                }}>
                <Text
                  style={{color: '#fff', fontSize: wp(6), fontWeight: '500'}}>
                  {utility.getBloodByID(item?.blood_group)}
                </Text>
              </LinearGradient>

              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontWeight: '600',
                    fontSize: wp(4.4),
                    color: '#000',
                    marginRight: wp(28),
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{fontWeight: '500', fontSize: wp(3.5), color: '#555'}}>
                  {utility.getGenderByID(item?.gender)}, {item.city}
                </Text>
              </View>

              {item?.recive_status === '1' ? (
                <View
                  style={{
                    position: 'absolute',
                    right: 10,
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'center',
                  }}>
                  <Text
                    onPress={() => {
                      handleStatus('2', item.id);
                    }}
                    style={{
                      fontWeight: '700',
                      color: 'green',
                      paddingVertical: 2,
                    }}>
                    Accept
                  </Text>
                  <Text
                    onPress={() => {
                      handleStatus('3', item.id);
                    }}
                    style={{
                      fontWeight: '700',
                      color: 'red',
                      marginTop: hp(0.5),
                      paddingVertical: 2,
                    }}>
                    Reject
                  </Text>
                </View>
              ) : item?.recive_status === '2' ? (
                <View
                  style={{
                    position: 'absolute',
                    right: 10,
                    alignItems: 'center',
                    height: '100%',
                    marginRight: wp(2),
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    // activeOpacity={1}
                    onPress={() => Linking.openURL(`tel:${item.number}`)}
                    style={{}}>
                    <LinearGradient
                      colors={['#FF6382', '#E03456']}
                      style={{
                        borderRadius: wp(100),
                        paddingHorizontal: hp(1.5),
                        paddingVertical: hp(1.5),
                      }}>
                      <Feather name="phone-call" color={'#fff'} size={wp(5)} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : item?.recive_status === '3' ? (
                <View
                  style={{
                    position: 'absolute',
                    right: 10,
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontWeight: '700',
                      color: 'red',
                      marginTop: hp(0.5),
                      paddingVertical: 2,
                    }}>
                    Rejected
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    position: 'absolute',
                    right: 10,
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'center',
                  }}>
                  <LinearGradient
                    colors={['#FF6382', '#E03456']}
                    style={{
                      borderRadius: wp(10),
                      paddingHorizontal: hp(1.5),
                      paddingVertical: hp(1),
                    }}>
                    <Text
                      style={{
                        fontWeight: '700',
                        color: '#fff',
                      }}>
                      Thank You
                    </Text>
                  </LinearGradient>
                </View>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default RequestHistory;

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

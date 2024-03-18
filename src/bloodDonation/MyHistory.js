/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import React, {useState, useEffect} from 'react';
import {
  Alert,
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

import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {async_keys, storeData} from '../api/UserPreference';
import AppLoader from '../provider/AppLoader';
import {utility} from '../provider/Util';
import {Icon} from '@rneui/themed';

const MyHistory = ({navigation}) => {
  const [donorList, setDonorList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    makeRequest('my-history')
      .then(result => {
        const {Status} = result;
        if (Status === true) {
          setDonorList(result.Data);
        }
        setLoader(false);
      })
      .catch(e => {
        setLoader(false);
      });
  }, []);

  const handleDelete = id => {
    try {
      Alert.alert(
        'Delete',
        'Are you sure, you want to delete the request?',
        [
          {text: 'NO', style: 'cancel'},
          {
            text: 'YES',
            onPress: async () => {
              setLoader(true);

              makeRequest(`delete-blood-request/${id}`)
                .then(result => {
                  const {Status} = result;
                  if (Status === true) {
                    setDonorList(prev => prev.filter(item => item.id !== id));
                  }
                  setLoader(false);
                })
                .catch(e => {
                  setLoader(false);
                  console.log('delete-blood-request', e);
                });
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    } catch (error) {
      setLoader(false);
    }
  };

  const handleConfirm = item => {
    console.log(item);
    const {id, name} = item;

    navigation.navigate('GenerateCertificate', {id, name});
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF6382" barStyle="light-content" />

      <AppLoader loading={loader} />
      <AuthHeader title="My History" />

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
          renderItem={({item}) => (
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
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                activeOpacity={0.9}
                style={{
                  position: 'absolute',
                  right: -1,
                  top: -10,
                }}>
                <Icon
                  reverse
                  type="antdesign"
                  name="delete"
                  color="red"
                  size={wp(2.8)}
                  containerStyle={{margin: 0}}
                  iconStyle={{fontSize: wp(4.5)}}
                />
              </TouchableOpacity>

              <LinearGradient
                colors={['#FF6382', '#E03456']}
                style={{
                  borderRadius: wp(3),
                  paddingHorizontal: hp(2.5),
                  paddingVertical: hp(2.5),
                  top: hp(-3),
                  marginLeft: wp(-8),
                  marginRight: wp(3),
                }}>
                <Text
                  style={{color: '#fff', fontSize: wp(6), fontWeight: '500'}}>
                  {utility.getBloodByID(item?.blood_group)}
                </Text>
              </LinearGradient>

              <View style={{flex: 1, marginRight: wp(1)}}>
                <Text
                  style={{fontWeight: '600', fontSize: wp(4.4), color: '#000'}}>
                  {item.name}
                </Text>
                <Text
                  style={{fontWeight: '500', fontSize: wp(3.5), color: '#555'}}>
                  {utility.getGenderByID(item?.gender)}, {item?.city}
                </Text>
              </View>

              {Number(item?.recive_status) === 2 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    // position: 'absolute',
                    // right: 10,
                    // alignSelf: 'center',
                    // alignItems: 'center',
                    // flex: 0.8,
                    position: 'absolute',
                    right: 10,
                    alignItems: 'center',
                    height: '100%',
                    marginRight: wp(2),
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
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

                  <Text
                    onPress={() => handleConfirm(item)}
                    style={{
                      fontSize: wp(3.3),
                      fontWeight: '500',
                      color: '#fff',
                      backgroundColor: 'green',
                      paddingHorizontal: wp(1),
                      paddingBottom: hp(1),
                      paddingTop: hp(0.8),
                      borderRadius: 5,
                      elevation: 5,
                      marginLeft: wp(2),
                    }}>
                    Confirm
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    position: 'absolute',
                    right: 10,
                    alignSelf: 'center',
                    fontWeight: '700',
                    color:
                      Number(item?.recive_status) === 1
                        ? 'orange'
                        : Number(item?.recive_status) === 4
                        ? 'green'
                        : 'red',
                  }}>
                  {utility.getStatusOfMyHistory(Number(item?.recive_status))}
                </Text>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default MyHistory;

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

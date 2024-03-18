/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Icon} from '@rneui/themed';
import moment from 'moment';

//Vector Icon...
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

//Image & Icons...
import ic_home_menu from '../assets/Icon/home_menu.png';
import ic_notification from '../assets/Icon/notification.png';
import HomeBannerSvg from '../assets/svg-Images/HomeBannerSvg';
import HomeFindIconSvg from '../assets/svg-Images/HomeFindIconSvg';
import HomeJobIconSvg from '../assets/svg-Images/HomeJobIconSvg';
import HomeBusIconSvg from '../assets/svg-Images/HomeBusIconSvg';

//Components...
import SubmitButton from '../components/SubmitButton';
import useHardwareBackPress from '../components/useHardwareBackPress';

// API Info...
import {makeRequest} from '../api/ApiInfo';

// User Preference...
import {async_keys, getData} from '../api/UserPreference';

//Provider...
import AppLoader from '../provider/AppLoader';
import {utility} from '../provider/Util';

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
      <TouchableOpacity>
        <Text
          style={{
            marginLeft: wp(3),
            fontSize: wp(3.5),
            fontWeight: '600',
            color: '#595959',
          }}>
          Hi,{`\n`}
          <Text
            style={{
              color: '#000',
              fontSize: wp(5),
              fontWeight: '700',
            }}>
            {profileDetails?.name || ''}
          </Text>
        </Text>
      </TouchableOpacity>
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

const HomeScreen = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [profileDetails, setProfileDetails] = useState({});
  const [donorList, setDonorList] = useState([]);

  useEffect(() => {
    // navigation.dispatch(state => console.log('state', state));
    initializeHome();
    // clearData();
  }, []);

  useHardwareBackPress(() => {
    Alert.alert(
      'Exit App',
      'Do you want to exit?',
      [
        {
          text: 'No',
          //   onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => BackHandler.exitApp()},
      ],
      {cancelable: false},
    );
    return true;
  });

  const initializeHome = () => {
    getData(async_keys.user_detail)
      .then(details => {
        setProfileDetails(details);
      })
      .catch(e => console.log(e));

    setLoader(true);
    makeRequest('my-request')
      .then(result => {
        setDonorList(
          result?.Data?.filter(item => Number(item.status) === 1).slice(0, 6) ||
            [],
        );
        setLoader(false);
      })
      .catch(e => {
        setLoader(false);
        console.log('my-request', e);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <AppLoader loading={loader} />
      <Header navigation={navigation} profileDetails={profileDetails} />

      <KeyboardAwareScrollView style={{flex: 1}}>
        <LinearGradient
          colors={['#FF6382', '#E03456']}
          style={{
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: wp(5),
            marginTop: hp(3),
          }}>
          <HomeBannerSvg />
          <View
            style={{
              paddingRight: wp(4),
            }}>
            <Text
              style={{
                color: '#fff',
                fontWeight: '900',
                fontSize: wp(5),
                textAlign: 'center',
              }}>
              Give the gift{`\n`}of life.{`\n`}Donate blood{`\n`}today!
            </Text>
          </View>
        </LinearGradient>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: wp(5),
            marginVertical: hp(4),
          }}>
          <LinearGradient
            colors={['#FF6382', '#E03456']}
            style={{
              borderRadius: 20,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('FindBloodDoner')}
              style={{
                height: 128,
                width: wp(40),
                borderRadius: 20,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <HomeFindIconSvg />
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '900',
                  marginBottom: hp(1),
                }}>
                Find a Donor
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={['#FF6382', '#E03456']}
            style={{
              borderRadius: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                alert('Coming Soon');
              }}
              style={{
                height: 128,
                width: wp(40),
                borderRadius: 20,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <FontAwesome6 name="hospital" color={'#fff'} size={wp(18)} />
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '900',
                  marginBottom: hp(1),
                  marginTop: hp(0.7),
                }}>
                Find a Camp
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: wp(5),
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              alignSelf: 'flex-start',
              borderBottomWidth: wp(0.4),
              paddingBottom: hp(0.5),
              color: '#000',
              fontSize: wp(5),
              borderBottomColor: 'red',
            }}>
            Help Us,
          </Text>
          <Text
            onPress={() => navigation.navigate('RequestHistory')}
            style={{
              color: '#333',
              fontSize: wp(4.3),
              fontWeight: '500',
              borderBottomWidth: wp(0.4),
              paddingBottom: hp(0.5),
              borderBottomColor: 'red',
            }}>
            View All
          </Text>
        </View>

        <View style={{marginVertical: hp(1)}}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={donorList}
            ListEmptyComponent={() => (
              <Text
                style={{
                  color: '#333',
                  marginVertical: hp(6),
                  width: wp(100),
                  textAlign: 'center',
                  fontSize: wp(4.3),
                  fontWeight: '500',
                }}>
                No request found{' '}
                <Text
                  style={{
                    color: 'red',
                    fontSize: wp(6),
                    fontWeight: '500',
                  }}>
                  !
                </Text>
              </Text>
            )}
            renderItem={({item, index}) => (
              <View
                style={[
                  {
                    marginHorizontal: wp(3),
                    marginVertical: hp(2),
                    elevation: 5,
                    borderRadius: wp(4),
                    paddingBottom: wp(2),
                    backgroundColor: '#fff',
                  },
                  index === 0 && {marginLeft: wp(5)},
                  index === [1, 2, 3].length - 1 && {marginRight: wp(5)},
                ]}>
                <LinearGradient
                  colors={['#FF6382', '#E03456']}
                  style={{
                    width: wp(10),
                    height: wp(10),
                    borderRadius: wp(5),
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    right: 8,
                    top: 8,
                  }}>
                  <Text style={{color: '#fff'}}>
                    {utility.getBloodByID(item?.blood_group)}
                  </Text>
                </LinearGradient>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: wp(80),
                    paddingHorizontal: wp(5),
                    paddingVertical: hp(1.2),
                  }}>
                  <Icon
                    type="font-awesome"
                    name="user-circle"
                    color="#000"
                    size={wp(15)}
                  />

                  <View style={{marginLeft: wp(4)}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingLeft: wp(2),
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: wp(5),
                          fontWeight: '500',
                        }}>
                        {item?.name}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: hp(1),
                      }}>
                      <Icon
                        type="evilicon"
                        name="location"
                        color="#FB5C7C"
                        containerStyle={{
                          margin: 0,
                          marginHorizontal: 0,
                          paddingHorizontal: 0,
                        }}
                      />
                      <Text
                        style={{
                          color: '#9f9f9f',
                          fontWeight: '500',
                        }}>
                        {utility.getGenderByID(item?.gender)}, {item?.city}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Icon
                        type="material-icon"
                        name="watch-later"
                        color="#FB5C7C"
                        size={wp(5)}
                        containerStyle={{marginRight: wp(1), marginLeft: 2}}
                      />
                      <Text
                        style={{
                          color: '#9f9f9f',
                          fontWeight: '500',
                        }}>
                        {moment(item?.created_at).format('hh:mm A')}
                      </Text>
                    </View>
                  </View>
                </View>

                <SubmitButton
                  title="Donate Now"
                  style={{
                    marginTop: wp(0.2),
                    marginHorizontal: wp(4),
                    borderRadius: hp(8),
                  }}
                  containerStyle={{
                    paddingVertical: hp(0.5),
                  }}
                  titleStyle={{fontSize: wp(3), fontWeight: '500'}}
                />
              </View>
            )}
          />
        </View>

        <Text
          style={{
            alignSelf: 'flex-start',
            borderBottomWidth: wp(0.5),
            color: '#000',
            fontSize: wp(5),
            marginHorizontal: wp(5),
            marginVertical: hp(2),
            marginBottom: hp(3),
            paddingBottom: hp(0.5),
            borderBottomColor: 'red',
          }}>
          Coming Soon,
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: wp(5),
            marginBottom: hp(5),
          }}>
          <TouchableOpacity onPress={() => alert('Coming soon')}>
            <HomeJobIconSvg />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => alert('Coming soon')}
            style={{marginLeft: wp(7)}}>
            <HomeBusIconSvg />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

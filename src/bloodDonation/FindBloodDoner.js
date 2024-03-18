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
import FindDonorImage from '../assets/svg-Images/FindDonorImage';
import MainHeader from '../components/MainHeader';

import ic_menu from '../assets/Icon/menu.png';
import FindDonorListIcon from '../assets/svg-Images/FindDonorListIcon';
import FindDonorListIconSent from '../assets/svg-Images/FindDonorListIconSent';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {async_keys, storeData} from '../api/UserPreference';
import AppLoader from '../provider/AppLoader';
import {utility} from '../provider/Util';

const FindBloodDoner = () => {
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [loader, setLoader] = useState(false);

  const [bloodGroup, setBloodGroup] = useState(utility.blood_group);
  const [donorList, setDonorList] = useState([]);

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

  const getCity = async stateSelected => {
    setLoader(true);
    try {
      const response = await makeRequest(`get-city/${stateSelected}`);

      console.log('City API response:', response);

      if (response && response.status === 200) {
        const {data} = response; // Assuming the JSON data is directly available in the response
        setCity(data);
      } else {
        console.error(
          'City API request failed. Status:',
          response ? response.status : 'Unknown',
        );
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);

      console.error('Error fetching city:', error.message);
    }
  };

  const handleStateChange = item => {
    setSelectedState(item.name);
    getCity(item.name); // Fetch cities based on the selected state
  };

  // const getDetail = async () => {
  //   try {
  //     const response = await makeRequest(
  //       'get-follow-up-leads/' + leadId,
  //     );

  //     if (response) {
  //       const {Status, Data} = response;

  //       if (Status === true) {
  //         setComments(Data.lead);
  //         setLeadDetail(Data.customer_data);
  //         setIsLoading(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      // setShowProcessingLoader(true);
      const params = {
        state: selectedState,
        city: selectedCity,
        blood_group: bloodGroup.filter(item => item.selected)[0].id,
      };

      // calling api
      setLoader(true);
      const response = await makeRequest('get-blood-requester', params, true);

      if (response) {
        const {Status, message} = response;

        if (Status === true) {
          const {Data} = response;
          if (Data.length == 0) alert('No donor found');
          setDonorList(Data || []);
        }
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error.message);
    }
  };

  const handleRequest = async item => {
    if (!item?.userId) false;

    setLoader(true);
    makeRequest('blood-request', {id: item?.userId}, true)
      .then(result => {
        const {Status, message} = result;
        if (Status === true) {
          setDonorList(prevList =>
            prevList.map(i =>
              i.userId === item.userId ? {...i, requested: true} : i,
            ),
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

  const renderDdItem = (item, index) => {
    return (
      <Text
        style={{marginHorizontal: wp(4), marginVertical: hp(2), color: '#000'}}>
        {item.name}
      </Text>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF6382" barStyle="light-content" />

      <AppLoader loading={loader} />

      <MainHeader title="Find Blood" height={'36%'} onMenuPress={onMenuPress} />

      <View style={{flex: 1.8, marginTop: hp(10)}}>
        <FlatList
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          data={donorList}
          ListEmptyComponent={() => (
            <View style={{alignItems: 'center'}}>
              <FindDonorImage />
            </View>
          )}
          ListHeaderComponent={() => (
            <>
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
                  Find a donor
                </Text>

                <Dropdown
                  // mode="auto"
                  style={[
                    styles.dropdown,
                    {
                      marginVertical: hp(1),
                      borderBottomWidth: 0.6,
                      borderColor: '#555',
                    },
                    isFocus && {borderColor: 'blue'},
                  ]}
                  itemTextStyle = {{color: '#000'}}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={state}
                  maxHeight={300}
                  labelField="name"
                  valueField="name"
                  placeholder="Select State"
                  value={selectedState}
                  // onFocus={() => setIsFocus(true)}
                  // onBlur={() => setIsFocus(false)}
                  onChange={handleStateChange}
                  renderItem={renderDdItem}
                />

                <Dropdown
                  mode="auto"
                  style={[
                    styles.dropdown,
                    {
                      marginVertical: hp(1),
                      borderBottomWidth: 0.6,
                      borderColor: '#555',
                    },
                    // isFocus && {borderColor: 'blue'},
                  ]}
                  itemTextStyle = {{color: '#000'}}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={city}
                  search
                  searchPlaceholder="Search..."
                  maxHeight={300}
                  labelField="name"
                  valueField="name"
                  placeholder="Select City"
                  value={selectedCity}
                  // onFocus={() => setIsFocus(true)}
                  // onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setSelectedCity(item.name);
                  }}
                  renderItem={renderDdItem}
                />

                <View
                  style={[
                    {
                      marginVertical: hp(1),
                      zIndex: 999,
                    },
                  ]}>
                  <Text style={{marginBottom: hp(2)}}>Choose Blood Group</Text>

                  <FlatList
                    scrollEnabled={false}
                    numColumns={6}
                    data={bloodGroup}
                    keyExtractor={item => item.id}
                    renderItem={({item, index}) => (
                      <View
                        style={{
                          width: `${100 / 6}%`,
                          alignItems: 'center',
                        }}>
                        <LinearGradient
                          style={{
                            width: '80%',
                            height: wp(10),
                            borderWidth: item.selected ? 0 : 2,
                            borderColor: '#595959',
                            marginBottom: hp(1),
                            borderRadius: wp(2),
                          }}
                          colors={
                            item.selected
                              ? ['#FF6382', '#E03456']
                              : ['#fff', '#fff']
                          }>
                          <Text
                            onPress={() =>
                              setBloodGroup(
                                bloodGroup.map(i => {
                                  if (i.blood_group === item.blood_group) {
                                    return {...i, selected: !i.selected};
                                  } else {
                                    return {...i, selected: false};
                                  }
                                }),
                              )
                            }
                            style={{
                              color: item.selected ? '#fff' : '#000',
                              textAlign: 'center',
                              textAlignVertical: 'center',
                              flex: 1,
                            }}>
                            {item.blood_group}
                          </Text>
                        </LinearGradient>
                      </View>
                    )}
                  />

                  <SubmitButton title="Continue" onPress={handleSubmit} />
                </View>
              </View>
              <Text
                style={{
                  marginHorizontal: wp(5),
                  marginVertical: hp(2),
                  fontSize: wp(4.5),
                  color: '#000',
                  textDecorationLine: 'underline',
                  letterSpacing: 0.7,
                }}>
                {donorList.length > 0 && 'Result'}
              </Text>
            </>
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
                marginVertical: hp(2.5),
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
                  {utility.getBloodByID(item.blood_group)}
                </Text>
              </LinearGradient>

              <View style={{}}>
                <Text
                  style={{fontWeight: '600', fontSize: wp(4.4), color: '#000'}}>
                  {item.name}
                </Text>
                <Text
                  style={{fontWeight: '500', fontSize: wp(3.5), color: '#555'}}>
                  {utility.getGenderByID(item.gender)}, {item.city}
                </Text>
              </View>
              <TouchableOpacity
                disabled={item?.requested}
                activeOpacity={1}
                onPress={() => handleRequest(item)}
                style={{
                  position: 'absolute',
                  right: wp(5),
                }}>
                {item?.requested ? (
                  <FindDonorListIconSent />
                ) : (
                  <FindDonorListIcon />
                )}
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default FindBloodDoner;

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
  placeholderStyle: {
    color: '#999',
  },
});

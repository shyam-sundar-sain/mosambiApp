/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {CheckBox, Icon} from '@rneui/themed';

import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SubmitButton from '../components/SubmitButton';
import FindDonorImage from '../assets/svg-Images/FindDonorImage';
import MainHeader from '../components/MainHeader';

import ic_edit from '../assets/Icon/edit.png';
import ic_save from '../assets/Icon/save.png';
import ProfilePhoto from '../assets/Image/ProfilePhoto.png';
import FindDonorListIcon from '../assets/svg-Images/FindDonorListIcon';
import FindDonorListIconSent from '../assets/svg-Images/FindDonorListIconSent';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {async_keys, getData, storeData} from '../api/UserPreference';
import {utility} from '../provider/Util';
import AppLoader from '../provider/AppLoader';

const UpdateProfile = ({navigation}) => {
  const [profileDetails, setProfileDetails] = useState({
    account_number: null,
    address: null,
    bank_account_name: null,
    blood_group: '1',
    city: 'Buxar',
    created_at: '2024-02-09T06:20:35.000000Z',
    dob: '09-02-2024',
    email: 'keshav@test.com',
    email_verified_at: null,
    from_referal: null,
    gender: '1',
    id: 66,
    ifsc: null,
    image: null,
    name: 'Keshav',
    number: '7742421918',
    organiser_status: 0,
    otp: null,
    referal_code: 'Keshav6785',
    rejection_reason: null,
    state: 'Bihar (BR)',
    status: 1,
    updated_at: '2024-02-09T06:22:45.000000Z',
    upi_id: null,
    user_type: 1,
  });

  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [startDate, setStartDate] = useState('');

  const [isFocus, setIsFocus] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  useEffect(() => {
    getData(async_keys.user_detail)
      .then(details => {
        setProfileDetails(details);
      })
      .catch(e => console.log(e));

    getState();
  }, []);

  useEffect(() => {
    if (profileDetails?.state) {
      getCity(profileDetails?.state);
    }
  }, [profileDetails?.state]);

  const handleInputs = (key, value) =>
    setProfileDetails({...profileDetails, [key]: value});

  const handleShowDatePicker = () => {
    setIsDatePickerVisible({isDatePickerVisible: true});
  };

  const handleHideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleConfirm = date => {
    setStartDate(moment(date).format('DD-MM-YYYY'));
    setProfileDetails({
      ...profileDetails,
      dob: moment(date).format('DD-MM-YYYY'),
    });
    handleHideDatePicker();
  };

  const getState = async () => {
    try {
      setLoader(true);
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

  const getCity = async state_name => {
    try {
      setLoader(true);
      const response = await makeRequest(`get-city/${state_name}`);

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

  const onMenuPress = () => {};

  const handleSave = () => {
    setLoader(true);
    makeRequest(`update-profile`, profileDetails, true)
      .then(result => {
        const {Status, message} = result;
        if (Status === true) {
          ToastAndroid.showWithGravity(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
          storeData(async_keys.user_detail, profileDetails);
        } else {
          ToastAndroid.showWithGravity(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
        }
        setLoader(false);
      })
      .catch(e => {
        setLoader(false);
        console.log(e);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF6382" barStyle="light-content" />
      <AppLoader loading={loader} />

      <MainHeader title="My Profile" height={'36%'} onMenuPress={onMenuPress} />

      <View style={{flex: 1.8, marginTop: hp(10)}}>
        <View
          style={{
            backgroundColor: '#fff',
            elevation: 5,
            borderRadius: wp(5),
            padding: wp(5),
            //   marginTop: hp(-25),
            marginHorizontal: wp(5),
            marginBottom: hp(1),
          }}>
          <TouchableOpacity
            style={{position: 'absolute', right: 5, top: 5, zIndex: 999}}
            onPress={handleSave}>
            <LinearGradient
              colors={['#FF6382', '#E03456']}
              style={{
                height: hp(6),
                aspectRatio: 1 / 1,
                borderRadius: wp(100),
                justifyContent: 'center',
              }}>
              <Image
                source={ic_save}
                style={{
                  height: hp(1.5),
                  aspectRatio: 1 / 1,
                  alignSelf: 'center',
                }}
              />
            </LinearGradient>
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={ProfilePhoto}
              //   resizeMode="center"
              style={{
                height: hp(15),
                aspectRatio: 1 / 1,
                alignSelf: 'center',
                // marginTop: hp(-3),
              }}
            />
            <TextInput
              mode="flat"
              // label="Name"
              underlineColor="#555"
              activeUnderlineColor="#E03456"
              placeholder="Name"
              placeholderTextColor="#595959"
              textColor="#000"
              value={profileDetails?.name || ''}
              onChangeText={text => handleInputs('name', text)}
              style={styles.inputContainer}
              left={
                <TextInput.Icon
                  style={{alignSelf: 'flex-end'}}
                  icon={({iconColor}) => (
                    <Icon
                      color="#595959"
                      size={wp(5)}
                      type="font-awesome"
                      name="user-o"
                    />
                  )}
                />
              }
            />
            <TextInput
              mode="flat"
              // label="Email"
              // editable={false}
              placeholder="Email"
              textColor="#000"
              value={profileDetails?.email || ''}
              onChangeText={text => handleInputs('email', text)}
              underlineColor="#555"
              activeUnderlineColor="#E03456"
              style={styles.inputContainer}
              left={
                <TextInput.Icon
                  style={{alignSelf: 'flex-end'}}
                  icon={({iconColor}) => (
                    <Icon
                      color="#595959"
                      size={wp(5)}
                      type="material"
                      name="alternate-email"
                    />
                  )}
                />
              }
            />

            <TextInput
              mode="flat"
              // label="Mobile"
              editable={false}
              placeholder="Phone Number"
              textColor="#000"
              value={profileDetails?.number || ''}
              onChangeText={text =>
                handleInputs('number', text.replace(/\D/g, ''))
              }
              keyboardType="numeric"
              underlineColor="#555"
              activeUnderlineColor="#E03456"
              style={styles.inputContainer}
              left={
                <TextInput.Icon
                  style={{alignSelf: 'flex-end'}}
                  icon={({iconColor}) => (
                    <Icon
                      color="#595959"
                      size={wp(7)}
                      type="font-awesome"
                      name="mobile-phone"
                    />
                  )}
                />
              }
            />
            <View style={styles.genderContainer}>
              <Text style={{color: '#595959', fontWeight: '500'}}>Gender</Text>
              <View style={{flexDirection: 'row', marginVertical: hp(1)}}>
                {utility.gender.map(item => (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <CheckBox
                      checked={item.id === Number(profileDetails?.gender)}
                      onPress={() => {
                        setProfileDetails({
                          ...profileDetails,
                          gender: item?.id?.toString(),
                        });
                      }}
                      iconType="font-awesome"
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      checkedColor="#E03456"
                      uncheckedColor="#595959"
                      size={wp(5)}
                      containerStyle={{
                        padding: 0,
                        margin: 0,
                        marginLeft: 0,
                      }}
                    />

                    <Text style={{color: '#000', marginRight: wp(7)}}>
                      {item.gender}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View>
              {startDate === '' ? (
                <TextInput
                  editable={false}
                  mode="flat"
                  value={profileDetails?.dob}
                  textColor="#000"
                  placeholder="Date of Birth"
                  underlineColor="#595959"
                  activeUnderlineColor="#E03456"
                  style={styles.inputContainer}
                  left={
                    <TextInput.Icon
                      onPress={handleShowDatePicker}
                      style={{alignSelf: 'flex-end'}}
                      icon={({}) => (
                        <Icon
                          color="#595959"
                          size={wp(5)}
                          type="font-awesome"
                          name="calendar"
                        />
                      )}
                    />
                  }
                />
              ) : (
                <TextInput
                  editable={false}
                  mode="flat"
                  textColor="#000"
                  value={startDate}
                  underlineColor="#595959"
                  activeUnderlineColor="#E03456"
                  style={styles.inputContainer}
                  left={
                    <TextInput.Icon
                      onPress={handleShowDatePicker}
                      style={{alignSelf: 'flex-end'}}
                      icon={({}) => (
                        <Icon
                          color="#595959"
                          size={wp(5)}
                          type="font-awesome"
                          name="calendar"
                        />
                      )}
                    />
                  }
                />
              )}

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={handleHideDatePicker}
                data={startDate}
                // onDateChange={handleDateChange}
              />
            </View>

            <Dropdown
              mode="auto"
              style={[
                styles.dropdown,
                {
                  marginHorizontal: wp(5),
                  marginVertical: hp(2),
                  borderBottomWidth: 0.6,
                  borderColor: '#595959',
                  paddingBottom: hp(1),
                },
                // isFocus && {borderColor: 'blue'},
              ]}
              itemTextStyle={{color: '#000'}}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={state}
              maxHeight={300}
              labelField="name"
              valueField="name"
              placeholder="Select State"
              value={profileDetails?.state}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setProfileDetails({...profileDetails, state: item.name});
              }}
            />

            <Dropdown
              mode="auto"
              style={[
                styles.dropdown,
                {
                  marginHorizontal: wp(5),
                  marginVertical: hp(2),
                  borderBottomWidth: 0.6,
                  borderColor: '#595959',
                },
                // isFocus && {borderColor: 'blue'},
              ]}
              itemTextStyle={{color: '#000'}}
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
              value={profileDetails?.city}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                // setSelectedCity(item);
                setProfileDetails({...profileDetails, city: item.name});
                // setIsFocus(false);
              }}
            />

            <TextInput
              mode="flat"
              label="Account number"
              maxLength={16}
              // editable={false}
              placeholder="Account Number"
              textColor="#000"
              value={profileDetails?.account_number || ''}
              onChangeText={text =>
                handleInputs('account_number', text.replace(/\D/g, ''))
              }
              keyboardType="numeric"
              underlineColor="#555"
              activeUnderlineColor="#E03456"
              style={styles.inputContainer}
              left={
                <TextInput.Icon
                  style={{alignSelf: 'flex-end'}}
                  icon={({iconColor}) => (
                    <Icon
                      color="#595959"
                      size={wp(5)}
                      type="font-awesome"
                      name="credit-card"
                    />
                  )}
                />
              }
            />

            <TextInput
              mode="flat"
              label="Bank Account Name"
              // editable={false}
              placeholder="Bank Account Name"
              textColor="#000"
              value={profileDetails?.bank_account_name || ''}
              onChangeText={text => handleInputs('bank_account_name', text)}
              keyboardType="ascii-capable"
              underlineColor="#555"
              activeUnderlineColor="#E03456"
              style={styles.inputContainer}
              left={
                <TextInput.Icon
                  style={{alignSelf: 'flex-end'}}
                  icon={({iconColor}) => (
                    <Icon
                      color="#595959"
                      size={wp(5)}
                      type="font-awesome"
                      name="bank"
                    />
                  )}
                />
              }
            />

            <TextInput
              mode="flat"
              label="IFSC"
              // editable={false}
              placeholder="IFSC"
              textColor="#000"
              value={profileDetails?.ifsc || ''}
              onChangeText={text => handleInputs('ifsc', text?.toUpperCase())}
              keyboardType="ascii-capable"
              underlineColor="#555"
              activeUnderlineColor="#E03456"
              style={styles.inputContainer}
              left={
                <TextInput.Icon
                  style={{alignSelf: 'flex-end'}}
                  icon={({iconColor}) => (
                    <Icon
                      color="#595959"
                      size={wp(5)}
                      type="font-awesome"
                      name="bank"
                    />
                  )}
                />
              }
            />

            <TextInput
              mode="flat"
              label="Upi ID"
              // editable={false}
              placeholder="Upi ID"
              textColor="#000"
              value={profileDetails?.upi_id || ''}
              onChangeText={text => handleInputs('upi_id', text)}
              keyboardType="ascii-capable"
              underlineColor="#555"
              activeUnderlineColor="#E03456"
              style={styles.inputContainer}
              left={
                <TextInput.Icon
                  style={{alignSelf: 'flex-end'}}
                  icon={({iconColor}) => (
                    <Icon
                      color="#595959"
                      size={wp(5)}
                      type="material"
                      name="alternate-email"
                    />
                  )}
                />
              }
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: hp(2),
    borderRadius: wp(4),
  },
  inputContainer: {
    backgroundColor: 'transparent',
    marginHorizontal: wp(5),
  },
  genderContainer: {
    marginHorizontal: wp(5),
    marginVertical: hp(2),
  },
  selectedTextStyle: {
    color: '#000',
  },
  placeholderStyle: {
    color: '#000',
  },
  inputSearchStyle: {
    fontSize: wp(3.5),
    fontFamily: 'Roboto-Regular',
    color: '#eee',
    marginLeft: wp(2),
  },
  iconStyle: {
    color: '#000',
  },
});

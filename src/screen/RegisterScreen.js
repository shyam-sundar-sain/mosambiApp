/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import AuthHeader from '../components/AuthHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput} from 'react-native-paper';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {CheckBox, Icon} from '@rneui/themed';
import DropDown from 'react-native-paper-dropdown';
import {Dropdown} from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import SubmitButton from '../components/SubmitButton';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {async_keys, storeData} from '../api/UserPreference';
import {isEmailAddress} from '../validation/FormValidator';
import AppLoader from '../provider/AppLoader';
import {MessageProvider} from '../provider/MessageProvider';
import useHardwareBackPress from '../components/useHardwareBackPress';

const RegisterScreen = ({navigation, route}) => {
  useHardwareBackPress(() => navigation.pop(1));

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({
    name: false,
    email: false,
    gender: false,
    startDate: false,
    selectedState: false,
    selectedCity: false,
    bloodGroup: false,
  });

  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    gender: '',
    startDate: '',
    selectedState: '',
    selectedCity: '',
    bloodGroup: '',
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [state, setState] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [gender, setGender] = useState([
    {id: 1, gender: 'Male', selected: false},
    {id: 2, gender: 'Female', selected: false},
    {id: 3, gender: 'Others', selected: false},
  ]);
  const [bloodGroup, setBloodGroup] = useState([
    {id: 1, group: 'A+', selected: false},
    {id: 2, group: 'A-', selected: false},
    {id: 3, group: 'B+', selected: false},
    {id: 4, group: 'B-', selected: false},
    {id: 5, group: 'O+', selected: false},
    {id: 6, group: 'O-', selected: false},
    {id: 7, group: 'AB+', selected: false},
    {id: 8, group: 'AB-', selected: false},
  ]);

  const mobile = route?.params?.mobNum;

  const handleInputs = (key, val) => {
    setError({...error, [key]: false});
    setInputs({...inputs, [key]: val});
  };

  const handleNameChange = text => {
    //  Remove non-alphabetic characters using a regular expression
    const sanitizedText = text.replace(/[^a-zA-Z]/g, ' ');
    setError({...error, name: false});
    setName(sanitizedText);
  };

  const handleEmailChange = text => {
    setError({...error, email: false});
    setEmail(text);
  };

  const handleShowHideDatePicker = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };

  const handleConfirm = date => {
    setError({...error, startDate: false});
    setStartDate(moment(date).format('DD-MM-YYYY'));
    handleShowHideDatePicker();
  };

  useEffect(() => {
    getState();
  }, []);

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

  const getCity = async stateSelected => {
    try {
      setLoader(true);
      const response = await makeRequest(`get-city/${stateSelected}`);

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
    getCity(item.name);
  };

  // const handleSubmit = async () => {
  //   let obj = error;
  //   let foundError = false;

  //   for (let key in inputs) {
  //     if (inputs[key]?.toString()?.trim() === '') {
  //       obj = {
  //         ...obj,
  //         [key]: true,
  //       };
  //       //FOR EMAIL
  //     } else if (key === 'email') {
  //       if (!isEmailAddress(inputs[key])) {
  //         obj = {
  //           ...obj,
  //           [key]: true,
  //         };
  //       }
  //     }
  //   }

  //   for (let key in obj) {
  //     if (obj[key] === true) {
  //       foundError = true;
  //     }
  //   }

  //   setError(obj);
  //   if (foundError) false;

  // // preparing params
  // const params = {
  //   name: inputs.name,
  //   state: inputs.selectedState,
  //   gender: inputs.gender,
  //   city: inputs.selectedCity,
  //   blood_group: inputs.bloodGroup,
  //   dob: inputs.startDate,
  //   number: mobile,
  //   email: inputs.email,
  // };

  //   navigation.navigate('CreatePassword', {params});
  // };

  const handleSubmit = () => {
    const newErrors = {};
    let foundError = false;

    for (let key in inputs) {
      if (!inputs[key]?.toString()?.trim()) {
        newErrors[key] = true;
        foundError = true;
      } else if (key === 'email' && !isEmailAddress(inputs[key])) {
        newErrors[key] = true;
        foundError = true;
      }
    }

    setError(newErrors);
    if (foundError) return; // Prevent navigation if there are errors

    // preparing params
    const params = {
      name: inputs.name,
      state: inputs.selectedState,
      gender: inputs.gender,
      city: inputs.selectedCity,
      blood_group: inputs.bloodGroup,
      dob: inputs.startDate,
      number: mobile,
      email: inputs.email,
    };

    // Continue with navigation or API call
    navigation.navigate('CreatePassword', {params});
  };

  return (
    <View style={styles.container}>
      <AppLoader loading={loader} />
      <AuthHeader title="Create Account" backDisable />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}>
        <TextInput
          mode="flat"
          // label="Name"
          placeholder="Name"
          placeholderTextColor="#595959"
          textColor="#000"
          value={name}
          onChangeText={text => {
            handleInputs('name', text);
            handleNameChange(text);
          }}
          underlineColor="#595959"
          activeUnderlineColor="#E03456"
          style={[styles.inputContainer, {marginTop: hp(1)}]}
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
        {error.name && (
          <Text
            style={{
              color: '#D70000',
              fontSize: wp(3),
              fontWeight: '500',
              top: 5,
              marginHorizontal: wp(5),
            }}>
            {MessageProvider.empty_name}
          </Text>
        )}

        <TextInput
          mode="flat"
          // label="Email"
          placeholder="Email"
          placeholderTextColor="#595959"
          textColor="#000"
          value={email}
          onChangeText={text => {
            handleInputs('email', text);
            handleEmailChange(text);
          }}
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
        {error.email && (
          <Text
            style={{
              color: '#D70000',
              fontSize: wp(3),
              fontWeight: '500',
              top: 5,
              marginHorizontal: wp(5),
            }}>
            {MessageProvider.valid_email}
          </Text>
        )}

        <TextInput
          mode="flat"
          // label="Mobile"
          editable={false}
          placeholder="Phone Number"
          placeholderTextColor="#595959"
          textColor="#000"
          value={mobile}
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
            {gender.map((item, index) => (
              <View
                key={index}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  checked={item.selected}
                  onPress={() => {
                    handleInputs('gender', item.id);
                    setGender(
                      gender.map(i => {
                        if (i.gender === item.gender) {
                          return {...i, selected: !i.selected};
                        } else {
                          return {...i, selected: false};
                        }
                      }),
                    );
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
          {error.gender && (
            <Text
              style={{
                color: '#D70000',
                fontSize: wp(3),
                fontWeight: '500',
                // top: 5,
                // marginHorizontal: wp(5),
              }}>
              {MessageProvider.gender}
            </Text>
          )}
        </View>

        <TouchableOpacity onPress={handleShowHideDatePicker}>
          <TextInput
            editable={false}
            mode="flat"
            textColor="#000"
            placeholder="Date of Birth"
            placeholderTextColor="#595959"
            value={startDate}
            underlineStyle={{
              borderWidth: isDatePickerVisible ? 2 : 0.1,
              borderColor: isDatePickerVisible ? '#E03456' : '#595959',
            }}
            style={styles.inputContainer}
            left={
              <TextInput.Icon
                onPress={handleShowHideDatePicker}
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
          {error.startDate && (
            <Text
              style={{
                color: '#D70000',
                fontSize: wp(3),
                fontWeight: '500',
                top: 5,
                marginHorizontal: wp(5),
              }}>
              {MessageProvider.dob}
            </Text>
          )}

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={date => {
              handleInputs('startDate', moment(date).format('DD-MM-YYYY'));
              handleConfirm(date);
            }}
            onCancel={handleShowHideDatePicker}
            data={startDate}
          />
        </TouchableOpacity>

        <Dropdown
          // mode="auto"
          style={[
            styles.dropdown,
            {
              marginHorizontal: wp(5),
              marginVertical: hp(1),
              borderBottomWidth: 0.6,
              borderColor: '#595959',
              paddingBottom: hp(1),
              color: '#000',
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
          value={selectedState}
          // onFocus={() => setIsFocus(true)}
          // onBlur={() => setIsFocus(false)}
          onChange={i => {
            handleInputs('selectedState', i.name);
            handleStateChange(i);
          }}
        />
        {error.selectedState && (
          <Text
            style={{
              color: '#D70000',
              fontSize: wp(3),
              fontWeight: '500',
              top: 5,
              marginHorizontal: wp(5),
            }}>
            {MessageProvider.state}
          </Text>
        )}

        <Dropdown
          // mode="auto"
          style={[
            styles.dropdown,
            {
              marginHorizontal: wp(5),

              borderBottomWidth: 0.6,
              borderColor: '#595959',
              paddingBottom: hp(1),
              color: '#000',
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
          value={selectedCity}
          // onFocus={() => setIsFocus(true)}
          // onBlur={() => setIsFocus(false)}
          onChange={item => {
            handleInputs('selectedCity', item.name);
            setSelectedCity(item.name);
            // setIsFocus(false);
          }}
        />
        {error.selectedCity && (
          <Text
            style={{
              color: '#D70000',
              fontSize: wp(3),
              fontWeight: '500',
              top: 5,
              marginHorizontal: wp(5),
            }}>
            {MessageProvider.city}
          </Text>
        )}

        <View style={[styles.genderContainer]}>
          <Text
            style={{marginBottom: hp(2), color: '#595959', fontWeight: '500'}}>
            Choose Blood Group
          </Text>

          <FlatList
            scrollEnabled={false}
            numColumns={6}
            data={bloodGroup}
            keyExtractor={item => item.group}
            renderItem={({item, index}) => (
              <View
                style={{
                  width: `${100 / 6}%`,
                  alignItems: 'center',
                }}>
                <LinearGradient
                  style={{
                    width: '80%',
                    height: wp(12),
                    borderWidth: item.selected ? 0 : 2,
                    borderColor: '#595959',
                    marginBottom: hp(1),
                    borderRadius: wp(2),
                  }}
                  colors={
                    item.selected ? ['#FF6382', '#E03456'] : ['#fff', '#fff']
                  }>
                  <Text
                    onPress={() => {
                      handleInputs('bloodGroup', item.id);
                      setBloodGroup(
                        bloodGroup.map(i => {
                          if (i.group === item.group) {
                            return {...i, selected: !i.selected};
                          } else {
                            return {...i, selected: false};
                          }
                        }),
                      );
                    }}
                    style={{
                      color: item.selected ? '#fff' : '#000',
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      flex: 1,
                    }}>
                    {item.group}
                  </Text>
                </LinearGradient>
              </View>
            )}
            contentContainerStyle={
              {
                //   borderWidth: 1,
                //   justifyContent: 'space-between',
              }
            }
          />
          {error.bloodGroup && (
            <Text
              style={{
                color: '#D70000',
                fontSize: wp(3),
                fontWeight: '500',
                top: 5,
                // marginHorizontal: wp(5),
              }}>
              {MessageProvider.bloodGroup}
            </Text>
          )}
        </View>

        <SubmitButton
          title="Continue"
          onPress={handleSubmit}
          style={{
            marginTop: hp(1),
            marginBottom: hp(5),
            marginHorizontal: wp(5),
          }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    backgroundColor: 'transparent',
    marginHorizontal: wp(5),
  },
  finputContainer: {
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
  selectedTextStyle: {
    color: '#000',
  },
  dropdown: {
    color: '#000',
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
});

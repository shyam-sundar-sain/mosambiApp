/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';

// Component
import CustomLoader from '../components/CustomLoader';
// import {showToast} from '../components/CustomToast';

// Icon
import gold_coin from '../assets/icons/gold_coin.png';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {async_keys, getData} from '../api/UserPreference';

import {isMobileNumber} from '../validation/FormValidator';
import AuthHeader from '../components/AuthHeader';

class RedeemScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCoin: this.props.route?.params?.coin || 0,
      redeemPoint: '',
      isLoading: false,
      showProcessingLoader: false,

      upi: '',
      backAccountNumber: '',
      ifscCode: '',
      bankName: '',
      email: '',
      profileDetails: {},
    };
  }

  componentDidMount() {
    getData(async_keys.user_detail)
      .then(profileDetails => this.setState({profileDetails}))
      .catch(e => console.log(e));
  }

  handlePointChange = redeemPoint => {
    this.setState({redeemPoint});
  };

  handleRedeem = async () => {
    // dismiss keyboard
    Keyboard.dismiss();

    // getting userId from AsyncStorage
    const id = await getData(async_keys.user_id);

    const {redeemPoint} = this.state;

    const notValidNumber = isNaN(redeemPoint);

    if (redeemPoint.trim() === '') {
      Alert.alert('', 'Please enter redeem point amount!', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (notValidNumber) {
      Alert.alert(
        '',
        'Please enter valid redeem point amount!',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    const {upi_id, account_number, ifsc, bank_account_name, email} =
      this.state?.profileDetails;

    if (upi_id.trim() === '' && account_number.trim() === '') {
      Alert.alert(
        '',
        'Please add your upi Id or Bank account number in edit profile page!',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (upi_id.trim() === '' && ifsc.trim() === '') {
      Alert.alert(
        '',
        'Please add your ifsc code in edit profile page!',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (upi_id.trim() === '' && bank_account_name.trim() === '') {
      Alert.alert(
        '',
        'Please add your bank name in edit profile page!',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (upi_id.trim() === '' && email.trim() === '') {
      Alert.alert(
        '',
        'Please add your email in edit profile page!',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    // starting processing loader
    this.setState({showProcessingLoader: true});
    makeRequest(
      `withdrawl-request`,
      {payment_method: 'bank', amount: redeemPoint},
      true,
    )
      .then(result => {
        const {Status, message} = result;
        ToastAndroid.showWithGravity(
          message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        this.setState({showProcessingLoader: true, redeemPoint: ''});
      })
      .catch(e => {
        this.setState({showProcessingLoader: true});
      });
  };

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={styles.container}>
        <AuthHeader title="Redeem Point" />

        <View style={styles.homeContainer}>
          <View style={styles.totalCoinContainer}>
            <Image
              source={gold_coin}
              resizeMode="cover"
              style={styles.totalCoinImage}
            />

            <Text style={styles.totalCoinText}>{this.state.totalCoin}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Image
              source={gold_coin}
              resizeMode="cover"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.loginFormTextInput}
              placeholder="Enter Redeem Points"
              placeholderTextColor="#c4c3cb"
              keyboardType="numeric"
              value={this.state.redeemPoint}
              onChangeText={this.handlePointChange}
            />
          </View>

          <TouchableOpacity
            style={styles.registerNowButton}
            onPress={this.handleRedeem}>
            <Text style={styles.signUpText}>Redeem</Text>
          </TouchableOpacity>
        </View>

        {/* <FooterComponent nav={this.props.navigation} /> */}

        {/* {this.state.showProcessingLoader && <ProcessingLoader />} */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: wp(6),
  },
  totalCoinContainer: {
    height: hp(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 10,
    borderColor: '#f1f1f1',
    borderRadius: wp(6),
  },
  totalCoinImage: {
    width: hp(10),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(2),
  },
  totalCoinText: {
    fontSize: wp(8),
    fontWeight: '700',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    height: hp(7),
    alignItems: 'center',
    marginBottom: hp(3),
    marginVertical: hp(2),
  },
  inputIcon: {
    width: wp(5),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  loginFormTextInput: {
    fontSize: wp(3.5),
    flex: 1,
    color: '#000',
  },
  registerNowButton: {
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#006836',
    borderRadius: wp(10),
    backgroundColor: '#006836',
    marginTop: hp(2),
  },
  signUpText: {
    fontSize: wp(3.7),
    fontWeight: '700',
    color: '#fff',
  },
});

export default RedeemScreen;

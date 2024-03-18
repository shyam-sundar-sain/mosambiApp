/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import SafeAreaView from 'react-native-safe-area-view';

// Component
// import HeaderComponent from '../component/HeaderComponent';
// import CustomLoader from '../component/CustomLoader';

// Icon
import wallet_arrow from '../assets/icons/wallet_arrow.png';
import flash from '../assets/icons/flash.png';
import card from '../assets/icons/card.png';
import phone_call from '../assets/icons/phone_call.png';
import ic_redeem from '../assets/icons/ic_redeem.png';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {async_keys, getData} from '../api/UserPreference';
import AuthHeader from '../components/AuthHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomLoader from '../components/CustomLoader';

export default class WalletScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      walletAmount: null,
      number: null,
      isLoading: false,
      data: {},
    };
  }

  componentDidMount() {
    this.fetchWalletData();
  }

  fetchWalletData = async () => {
    this.setState({isLoading: true});

    makeRequest('wallet')
      .then(result => {
        const {Status} = result;
        if (Status === true) {
          const {Data} = result;
          this.setState({data: Data, isLoading: false});
        }
        this.setState({isLoading: false});
      })
      .catch(error => {
        this.setState({isLoading: false});
        console.log('error', error);
      });
  };

  handleRedeem = () => {
    this.props.navigation.navigate('RedeemScreen', {
      coin: this.state.data?.coin || 0,
    });
  };

  handleViewPaymentHistory = () => {
    this.props.navigation.navigate('PaymentHistory');
  };

  handleCashOut = () => {
    this.props.navigation.navigate('CashOut');
  };

  handleMobile = async () => {
    try {
      let url = '';
      const phoneNumber = '+91 6376321234';

      if (Platform.OS === 'android') {
        url = `tel:${phoneNumber}`;
      } else if (Platform.OS === 'ios') {
        url = `teleprompt:${phoneNumber}`;
      }

      const supported = await Linking.openURL(`tel:${phoneNumber}`);

      if (supported) {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {isLoading, data} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={styles.container}>
        <AuthHeader title="Wallet" />

        <FlatList
          data={[
            ...(data?.credit_transaction || []),
            ...(data?.debit_transaction || []),
          ]}
          renderItem={({item}) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: wp(3),
                marginVertical: hp(1),
                backgroundColor: 'white',
                elevation: 5,
                paddingHorizontal: wp(3),
                paddingVertical: hp(1),
                borderRadius: wp(2),
              }}>
              <View>
                <Text
                  style={{
                    color:
                      item?.type?.toLowerCase() === 'credit' ? 'green' : 'red',
                    fontWeight: '900',
                    fontSize: wp(4),
                  }}>
                  {item?.type}
                </Text>
                <Text>{item?.date}</Text>
              </View>
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: wp(4),
                }}>
                {item?.amount}
              </Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <View style={styles.homeContainer}>
              <View style={styles.walletContainer}>
                <Text style={styles.balanceText}>Balance</Text>

                <TouchableOpacity
                  style={styles.amountContainer}
                  onPress={this.handleViewPaymentHistory}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={require('../assets/icons/gold_coin.png')}
                      style={{
                        width: wp(8),
                        aspectRatio: 1 / 1,
                        marginRight: wp(2),
                      }}
                    />

                    <Text style={styles.totalAmountText}>
                      {data.wallet_amount}
                    </Text>
                  </View>

                  <Image
                    source={wallet_arrow}
                    resizeMode="cover"
                    style={styles.arrowIconStyle}
                  />
                </TouchableOpacity>

                <Text style={styles.balanceText}>Payout now</Text>

                <TouchableOpacity
                  style={styles.cashOutContainer}
                  onPress={this.handleCashOut}>
                  <Image
                    source={flash}
                    resizeMode="cover"
                    style={styles.arrowIconStyle1}
                  />

                  <Text style={styles.buttonText}>Add Money</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.otherContainer}>
                <Image
                  source={ic_redeem}
                  resizeMode="cover"
                  style={styles.otherIconStyle}
                />
                <Text style={styles.otherText} onPress={this.handleRedeem}>
                  Redeem
                </Text>
              </View>

              <View style={styles.lineContainer1} />

              <View style={styles.otherContainer}>
                <Image
                  source={card}
                  resizeMode="cover"
                  style={styles.otherIconStyle}
                />
                <Text style={styles.otherText}>Payment Methods</Text>
              </View>

              <View style={styles.lineContainer1} />

              <View style={styles.otherContainer}>
                <Image
                  source={phone_call}
                  resizeMode="cover"
                  style={styles.otherIconStyle}
                />
                <Text style={styles.otherText} onPress={this.handleMobile}>
                  Call Now
                </Text>
              </View>

              <View style={styles.lineContainer1} />

              <Text
                style={{fontSize: wp(5), fontWeight: '900', marginTop: hp(1)}}>
                Transactions
              </Text>
            </View>
          )}
        />
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
    marginHorizontal: wp(2),
    margin: 4,
  },
  walletContainer: {
    height: hp(30),
    borderWidth: 1,
    marginHorizontal: wp(4),
    marginVertical: hp(4),
    borderColor: '#ccc',
    borderRadius: wp(4),
    overflow: 'hidden',
    elevation: 10,
    backgroundColor: '#ccc',
  },
  balanceText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#000',
    margin: wp(4),
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(4),
  },
  totalAmountText: {
    fontSize: wp(8),
    fontWeight: '700',
    color: '#000',
  },
  arrowIconStyle: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginLeft: 'auto',
  },
  cashOutContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: hp(6),
    width: wp(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp(2),
    borderRadius: wp(10),
    marginHorizontal: wp(2),
    marginVertical: hp(2),
  },
  buttonText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#000',
  },
  arrowIconStyle1: {
    width: hp(3),
    aspectRatio: 1 / 1,
  },
  otherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginVertical: hp(2),
  },
  otherIconStyle: {
    width: hp(3),
    aspectRatio: 1 / 1,
  },
  otherText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#000',
    marginLeft: wp(4),
    marginVertical: hp(1),
  },
  lineContainer1: {
    height: hp(0.2),
    backgroundColor: '#000',
    // marginHorizontal: wp(2),
    marginLeft: wp(15),
  },
});

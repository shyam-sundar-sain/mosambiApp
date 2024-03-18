/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Component
import HeaderComponent from '../component/HeaderComponent';
import CustomLoader from '../component/CustomLoader';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class TransactionDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionType: null,
      transactionAmount: null,
      status: null,
      dateAndTime: null,
      isLoading: false,
    };

    // fetching navigation props
    this.id = this.props.navigation.getParam('id', null);

    console.log(this.id);
  }

  // componentDidMount() {
  //   this.getTransactionDetail();
  // }

  // getTransactionDetail = async () => {
  //   try {
  //     // preparing params
  //     const params = {tranaction_id: this.id.transactionId};

  //     // calling api
  //     const response = await makeRequest(
  //       BASE_URL + 'getTransactionDetail',
  //       params,
  //     );

  //     // processing response
  //     if (response) {
  //       const {status, data} = response;

  //       if (status === 'Success') {
  //         console.log(data);
  //         this.setState({
  //           transactionType: data.transaction_type,
  //           transactionAmount: data.transaction_amount,
  //           status: data.status,
  //           dateAndTime: data.created_at,
  //           isLoading: false,
  //         });
  //       } else {
  //         this.setState({isLoading: false});
  //       }
  //     }
  //   } catch (error) {
  //     this.setState({isLoading: false});
  //     console.log(error.message);
  //   }
  // };

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title="Transaction Detail"
          navAction="back"
          nav={this.props.navigation}
        />

        <View style={styles.homeContainer}>
          <Text style={styles.titleText}>{this.state.transactionType}</Text>

          <Text style={styles.amountText}>₹ {this.id.item.wallet_amount}</Text>

          <Text style={styles.statusText}>Status</Text>

          <Text style={styles.otherText}>{this.id.item.type}</Text>

          <Text style={styles.statusText}>Date and Time</Text>

          <Text style={styles.otherText}>{this.id.item.added_date}</Text>
        </View>
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
    marginHorizontal: wp(4),
    margin: 16,
  },
  titleText: {
    fontSize: wp(4),
    color: '#838383',
  },
  amountText: {
    fontSize: wp(9),
    fontWeight: '700',
    color: '#000',
    marginBottom: hp(4),
  },
  statusText: {
    fontSize: wp(4),
    color: '#838383',
    marginTop: hp(4),
  },
  otherText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#000',
  },
});

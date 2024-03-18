/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Component
// import HeaderComponent from '../component/HeaderComponent';
// import FooterComponent from '../component/FooterComponent';
// import CustomLoader from '../component/CustomLoader';
// import {showToast} from '../component/CustomToast';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {async_keys, getData} from '../api/UserPreference';

const RedeemListScreen = (props, navigation) => {
  const [isLoading, setIsLoading] = useState(true);
  const [referList, setReferList] = useState(null);

  //   useEffect(() => {
  //     const getReferList = async () => {
  //       // getting id from async storage
  //       const id = await getData(async_keys.user_id);

  //       try {
  //         // preparing params
  //         const params = {user_id: id};

  //         // calling api
  //         const response = await makeRequest(
  //           BASE_URL + 'WithDrawAmountList',
  //           params,
  //         );

  //         if (response) {
  //           const {status, data, message} = response;

  //           if (status === 'Success') {
  //             setReferList(data);

  //             setIsLoading(false);

  //             console.log(referList, 'here');
  //           } else {
  //             // showing custom toast
  //             showToast(message);

  //             setIsLoading(false);
  //           }
  //         }
  //       } catch (error) {
  //         console.log(error.message);

  //         setIsLoading(false);
  //       }
  //     };
  //     return getReferList();
  //   }, []);

  const renderItem = ({item}) => (
    <ReferListComponent item={item} nav={props.navigation} />
  );

  const keyExtractor = (item, index) => index.toString();

  const itemSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader title="Redeem List" />
      <View style={styles.homeContainer}>
        <FlatList
          data={referList}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={itemSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.memberListContent}
        />
      </View>

      {/* <FooterComponent nav={props.navigation} /> */}
    </SafeAreaView>
  );
};

export default RedeemListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  homeContainer: {
    flex: 1,
  },
  memberListContent: {
    padding: wp(2),
  },
  separator: {
    height: wp(2),
  },
});

// Refer List Component

// Icon
import ic_refferal from '../assets/icons/ic_reffer.png';
import ic_more from '../assets/icons/ic_more.png';
import ic_less from '../assets/icons/ic_less.png';
import AuthHeader from '../components/AuthHeader';

const ReferListComponent = props => {
  const [showMore, setShowMore] = useState(false);

  const handleShow = async () => {
    setShowMore(true);
  };

  const handleLess = async () => {
    setShowMore(false);
  };

  const {item} = props;

  console.group(item);

  return (
    <SafeAreaView style={referStyle.listContainer}>
      <View style={[referStyle.direction, referStyle.memberLogo]}>
        <Image
          source={ic_refferal}
          resizeMode="cover"
          style={referStyle.referIconStyle}
        />

        <View style={referStyle.hiddenView}>
          <View style={[referStyle.direction, referStyle.memberLogo]}>
            <Text style={referStyle.referralName}>
              Withdraw Amount: {item.withdraw_amount}
            </Text>
          </View>

          {showMore === true ? (
            <View style={[referStyle.direction, referStyle.memberLogo]}>
              <Text style={referStyle.referralName}>
                Date: {item.added_date}
              </Text>
            </View>
          ) : null}

          {showMore === true ? (
            <View style={[referStyle.direction, referStyle.memberLogo]}>
              <Text style={referStyle.referralName}>
                Status:{' '}
                <Text style={referStyle.referralName1}>{item.status}</Text>
              </Text>
            </View>
          ) : null}
        </View>

        {showMore === false ? (
          <TouchableHighlight
            style={referStyle.iconContainer}
            onPress={handleShow}>
            <Image
              source={ic_more}
              resizeMode="cover"
              style={referStyle.showMoreIconStyle}
            />
          </TouchableHighlight>
        ) : (
          <TouchableHighlight
            style={referStyle.iconContainer}
            onPress={handleLess}>
            <Image
              source={ic_less}
              resizeMode="cover"
              style={referStyle.showMoreIconStyle}
            />
          </TouchableHighlight>
        )}
      </View>
    </SafeAreaView>
  );
};

const referStyle = StyleSheet.create({
  listContainer: {
    padding: wp(2),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: wp(2),
    overflow: 'hidden',
    elevation: 10,
  },
  direction: {
    flexDirection: 'row',
  },
  memberLogo: {
    alignItems: 'center',
  },
  referIconStyle: {
    width: hp(4),
    aspectRatio: 1 / 1,
  },
  referralName: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#000',
    marginHorizontal: wp(2),
  },
  referralName1: {
    fontSize: wp(4),
    fontWeight: '700',
    color: 'green',
    marginHorizontal: wp(2),
  },
  hiddenView: {
    paddingHorizontal: hp(2),
    width: wp(60),
    marginVertical: hp(1.5),
  },
  iconContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  showMoreIconStyle: {
    width: hp(3.5),
    aspectRatio: 1 / 1,
  },
});

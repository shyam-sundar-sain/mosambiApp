import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import AuthHeader from '../components/AuthHeader';

// screen
import OnGoingGame from './OnGoingGame';
import ExpiredGame from './ExpireGame';
import {makeRequest} from '../api/ApiInfo';
import AppLoader from '../provider/AppLoader';

const GameListScreen = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    makeRequest(`quiz-list`)
      .then(result => {
        const {Status} = result;
        if (Status === true) {
          setData(result.Data);
        }
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
      });
  }, []);

  // Tab Functionality
  const handleChangeTab = () => {
    setSelectedTab(1);
  };

  const handleChangeTab2 = () => {
    setSelectedTab(2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader title="Game List" />
      <AppLoader loading={isLoading} />

      <View style={styles.homeContainer}>
        {/* TAB SECTION... */}
        <View style={styles.tabSection}>
          <TouchableOpacity onPress={handleChangeTab}>
            <Text
              style={[
                styles.tabText,
                {textAlign: 'justify'},
                selectedTab === 1 && {fontWeight: '900'},
              ]}>
              Ongoing Game
            </Text>
          </TouchableOpacity>

          <View style={styles.verticalLine} />

          <TouchableOpacity onPress={handleChangeTab2}>
            <Text
              style={[
                styles.tabText,
                {textAlign: 'justify'},
                selectedTab === 2 && {fontWeight: '900'},
              ]}>
              Expired Game
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 1 ? (
          <OnGoingGame navigation={navigation} data={data} />
        ) : selectedTab === 2 ? (
          <ExpiredGame navigation={navigation} data={data} />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default GameListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
    // paddingTop: 20,
    // paddingHorizontal: wp(1),
  },
  tabSection: {
    height: hp(7),
    // width: '80%',
    // borderWidth: 1,
    // marginHorizontal: wp(2),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // alignSelf: 'center',
    // borderRadius: wp(100),
    // borderColor: '#ccc',
    // backgroundColor: '#fff',
  },
  individualTab: {
    flex: 1,
    height: hp(5),
    width: wp(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: wp(4),
    fontFamily: 'Roboto-Bold',
    // fontWeight: '500',
    color: '#000',
  },
  verticalLine: {
    width: 1,
    height: hp(5),
    backgroundColor: '#ccc',
  },
  headBoxContainer: {
    width: '100%',
    flexDirection: 'row',
    // alignItems: 'flex-end',
  },
  headBox: {
    direction: 'rtl',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    // padding: wp(1),
    backgroundColor: '#23416E',
    width: '50%',
  },
  profilePhoto: {
    height: hp(8),
    width: wp(16),
  },
  listText: {
    fontSize: wp(4),
    color: '#23416E',
    // fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
});

/* eslint-disable prettier/prettier */
/* eslint-disable radix */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

// Icon
import quiz from '../assets/game_image/quiz.png';
import coin from '../assets/game_image/coin.png';

// API Info
import {makeRequest} from '../api/ApiInfo';

// User Preference
import {async_keys, getData, storeData} from '../api/UserPreference';

class OnGoingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data || [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.setState({
      data: this.props.data.filter(item => item.quiz_status !== 'expired'),
    });
  }

  handleJoin = item => {
    const {entry_fees, id} = item;
    Alert.alert(
      'Are you sure?',
      `Please Notice! ${entry_fees} coins will be deducted from your wallet`,
      [
        {text: 'NO', style: 'cancel'},
        {
          text: 'YES',
          onPress: async () => {
            makeRequest(`quiz/${id || ''}`)
              .then(async result => {
                const {Status, message} = result;
                if (Status === true) {
                  const {Data} = result;
                  await storeData(async_keys.active_quiz_id, id);
                  this.props.navigation.navigate('QuizPlayScreen', {Data});
                } else {
                  ToastAndroid.showWithGravity(
                    message,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                  );
                }
                this.setState({isLoading: false});
              })
              .catch(e => {
                this.setState({isLoading: false});
                console.log(e);
              });
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  render() {
    const {data, isLoading} = this.state;

    // if (isLoading) {
    //   return <CustomLoader />;
    // }

    return (
      <View style={styles.homeContainer}>
        <FlatList
          data={this.props.data.filter(item => item.quiz_status !== 'expired')}
          renderItem={({item, index}) => {
            // calculating difference between end time and current time
            var date = new Date();

            var current_time =
              date.getHours() +
              ':' +
              date.getMinutes() +
              ':' +
              date.getSeconds();
            var time = current_time;

            var now = moment(item.end_time, 'HH:mm:ss');
            var then = moment(time, 'HH:mm:ss');

            moment
              .utc(
                moment(now, 'DD/MM/YYYY HH:mm').diff(
                  moment(then, 'DD/MM/YYYY HH:mm'),
                ),
              )
              .format('HH:mm:ss');
            var c = moment
              .utc(
                moment(now, 'DD/MM/YYYY HH:mm').diff(
                  moment(then, 'DD/MM/YYYY HH:mm'),
                ),
              )
              .format('HH[Hours] :' + ' ' + 'mm[Minutes]');

            return (
              <LinearGradient
                start={{x: 1, y: 1}}
                end={{x: 0, y: 0}}
                colors={[
                  // '#01BAE9',
                  // '#20BF59',
                  '#D39D38',
                  '#4B0082',
                  // '#0000FF',
                  // '#00FF00',
                  // '#FFFF00',
                  // '#FF7F00',
                  // '#FF0000',
                ]}
                style={styles.listContainer}>
                <View style={[styles.direction, styles.memberLogo]}>
                  <View style={styles.memberLogoContainer}>
                    <Image
                      source={quiz}
                      resizeMode="cover"
                      style={styles.logoSize}
                    />
                  </View>
                  <View style={styles.contactDetail}>
                    <View style={[styles.direction, styles.contactRow]}>
                      <Text style={styles.totalPlayerText}>
                        Total Player: {item.total_players}
                      </Text>
                    </View>

                    <View style={[styles.direction, styles.contactRow]}>
                      <Text style={styles.totalPlayerText}>Prize Pool</Text>
                      {item?.quiz_status !== 'upcoming' && (
                        <Text style={styles.totalPlayerText1}>Time Left</Text>
                      )}
                    </View>

                    <View style={[styles.direction, styles.contactRow]}>
                      <Text style={styles.totalPlayerText}>
                        {item.winner1_amount} Coins
                      </Text>
                      {item?.quiz_status !== 'upcoming' && (
                        <Text style={styles.totalPlayerText1}>{c}</Text>
                      )}
                    </View>

                    <View style={[styles.direction, styles.contactRow]}>
                      <Image
                        source={coin}
                        resizeMode="cover"
                        style={styles.iconSize}
                      />

                      <Text style={styles.totalPlayerText}>
                        {item.entry_fees}
                      </Text>

                      {item?.quiz_status === 'ongoing' ? (
                        <TouchableOpacity
                          style={styles.buttonContainer}
                          onPress={() => this.handleJoin(item)}>
                          <Text style={styles.joinTextStyle}>JOIN</Text>
                        </TouchableOpacity>
                      ) : (
                        item?.quiz_status === 'upcoming' && (
                          <TouchableOpacity
                            activeOpacity={1}
                            style={{
                              height: hp(5),
                              width: wp(22),
                              position: 'absolute',
                              right: -10,
                              top: 10,
                            }}
                            // onPress={() => this.handleJoin(item)}
                          >
                            <Text
                              style={[
                                styles.joinTextStyle,
                                {color: '#4B0082'},
                              ]}>
                              Upcoming
                            </Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  </View>
                </View>
              </LinearGradient>
            );
          }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.key}
          ItemSeparatorComponent={this.itemSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.memberListContent}
        />
      </View>
    );
  }
}

export default OnGoingGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  listContainer: {
    padding: wp(2),
    backgroundColor: '#rgba(255, 255, 255, .2)',
    borderRadius: wp(2),
    marginVertical: hp(0.5),
    overflow: 'hidden',
    elevation: 6,
    // borderWidth: 2,
    borderColor: '#4B0082',
  },
  direction: {
    flexDirection: 'row',
  },
  memberLogoContainer: {
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
    borderColor: '#dddddd',
    padding: wp(0.5),
  },
  memberLogo: {
    alignItems: 'center',
    paddingBottom: wp(2),
  },
  logoSize: {
    height: wp(20),
    aspectRatio: 1 / 1,
    borderRadius: wp(2),
  },
  contactDetail: {
    paddingHorizontal: hp(2),
    width: wp(67),
  },
  contactRow: {
    paddingVertical: hp(0.2),
    alignItems: 'center',
  },
  contactRow1: {
    paddingVertical: hp(0.2),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  totalPlayerText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
  },
  totalPlayerText1: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
    marginLeft: 'auto',
  },
  iconSize: {
    width: hp(3),
    aspectRatio: 1 / 1,
    // marginHorizontal: wp(2),
    marginRight: wp(2),
  },
  buttonContainer: {
    height: hp(5),
    width: wp(22),
    alignItems: 'center',
    borderWidth: 2,
    justifyContent: 'center',
    marginLeft: 'auto',
    borderRadius: wp(10),
    backgroundColor: '#32cd32',
    borderColor: '#7fff00',
  },
  joinTextStyle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#fff',
  },
});

/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

// Icon
import quiz from '../assets/game_image/quiz.png';
import coin from '../assets/game_image/coin.png';
import man from '../assets/game_image/man.png';
import trophy from '../assets/game_image/trophy.png';

// API Info
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import CustomLoader from '../components/CustomLoader';

class ExpiredGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:
        this.props.data?.filter(item => item.quiz_status === 'expired') || [],
      topRankUser: [],
      isLoading: false,
      timeLeft: 0,
      showResult: false,
    };
  }

  componentDidMount() {
    this.setState({data: this.props.data});
  }

  handleJoin = item => {
    const {topRankUser} = item;
    this.setState({showResult: true, topRankUser});
  };

  handleDisableModal = async () => {
    // this.setState({showResult: false});
  };

  render() {
    const {data, isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    return (
      <View
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
        style={styles.homeContainer}>
        <FlatList
          data={this.props.data.filter(item => item.quiz_status === 'expired')}
          renderItem={({item, index}) => {
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
                      <Text style={styles.totalPlayerText1}>Ended</Text>
                    </View>

                    <View style={[styles.direction, styles.contactRow]}>
                      <Text style={styles.totalPlayerText}>
                        {item.winner1_amount} Coins
                      </Text>
                      {/* <Text style={styles.totalPlayerText1}>{seconds}</Text> */}
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

                      <TouchableOpacity
                        activeOpacity={1}
                        style={styles.buttonContainer}
                        onPress={() => this.handleJoin(item)}>
                        <Text style={styles.joinTextStyle}>View Result</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            );
          }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={this.itemSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.memberListContent}
        />

        {/* <Modal
          style={styles.modalStyle}
          isVisible={this.state.showResult}
          onBackdropPress={this.handleDisableModal}>
          <View style={styles.showResultContainer}>
            {this.state.topRankUser?.map(item => {
              return (
                <View key={item.id} style={styles.number2Container}>
                  <Text style={styles.top3Text}>Rank: {item.rank}</Text>
                  <Image
                    source={man}
                    resizeMode="cover"
                    style={styles.iconStyle}
                  />

                  <Text style={styles.nText} numberOfLines={1}>
                    {item.name}
                  </Text>

                  <View style={styles.rankContainer}>
                    <Image
                      source={trophy}
                      resizeMode="cover"
                      style={styles.trophyIcon}
                    />

                    <Text style={styles.rankText}>{item.total_score}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Modal> */}
      </View>
    );
  }
}

export default ExpiredGame;

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
    // elevation: 6,
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
    backgroundColor: '#00308F',
    borderColor: '#72A0C1',
  },
  joinTextStyle: {
    fontSize: wp(3.2),
    fontWeight: 'bold',
    color: '#fff',
  },
  modalStyle: {
    maxHeight: 250,
    top: hp(30),
    borderRadius: wp(1),
    backgroundColor: '#0f143c',
  },
  showResultContainer: {
    flexDirection: 'row',
    marginVertical: hp(4),
  },
  number2Container: {
    height: hp(17),
    width: wp(25),
    borderWidth: 1,
    borderRadius: wp(4),
    alignItems: 'center',
    backgroundColor: '#rgba(255, 255, 255, 0.4)',
    marginHorizontal: wp(2),
  },
  top3Text: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
  iconStyle: {
    height: hp(6),
    aspectRatio: 1 / 1,
  },
  nText: {
    fontSize: wp(3),
    fontWeight: '700',
    color: '#fff',
  },
  rankContainer: {
    flexDirection: 'row',
    marginVertical: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyIcon: {
    width: hp(2),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(1),
  },
  rankText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
  },
});

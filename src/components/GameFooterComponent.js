/* eslint-disable prettier/prettier */
import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  StyleSheet,
  Share,
  Linking,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Icon
import lobby from '../assets/game_image/lobby.png';
import leaderboard from '../assets/game_image/leaderboard.png';

export default class FooterComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleHome = () => {
    this.props.nav.navigate('GameHome');
  };

  handleShare = async () => {
    try {
      await Share.share({
        title: 'Share me',
        message:
          'https://play.google.com/store/apps/details?id=com.ecommerce.mosambi',
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  handleProfile = () => {
    this.props.nav.navigate('Profile');
  };

  handleGame = () => {
    this.props.nav.navigate('LeaderBoard');
  };

  handleSupport = () => {
    this.props.nav.navigate('Contact');
  };

  render() {
    const {tab} = this.props;
    const selectedTabStyle = [styles.footerMenu, {backgroundColor: '#ECEFFF'}];

    return (
      <SafeAreaView
        style={[
          this.state.checkDarkMode === 1
            ? styles.footerContainerBlack
            : styles.footerContainer,
        ]}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={this.handleHome}
          style={tab === 'TabView' ? selectedTabStyle : styles.footerMenu}>
          <View style={styles.singleMenu}>
            <Image source={lobby} style={styles.footerNavigatorIcon} />
            <Text
              style={[
                this.state.checkDarkMode === 1
                  ? styles.footerMenuTextBlack
                  : styles.footerMenuText,
              ]}>
              Home
            </Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this.handleGame}
          style={tab === 'Game' ? selectedTabStyle : styles.footerMenu}>
          <View style={styles.singleMenu}>
            <Image source={leaderboard} style={styles.footerNavigatorIcon} />
            <Text
              style={[
                this.state.checkDarkMode === 1
                  ? styles.footerMenuTextBlack
                  : styles.footerMenuText,
              ]}>
              Leaderboard
            </Text>
          </View>
        </TouchableHighlight>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    height: hp(8),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f2f1f1',
  },
  footerContainerBlack: {
    height: hp(8),
    backgroundColor: '#121212',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#121212',
  },
  footerMenu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleMenu: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerNavigatorIcon: {
    height: wp(6),
    aspectRatio: 1 / 1,
  },
  footerMenuText: {
    fontSize: wp(3),
    color: '#000',
    fontWeight: '700',
  },
  footerMenuTextBlack: {
    fontSize: wp(3),
    color: '#fff',
  },
});

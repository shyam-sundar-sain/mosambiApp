/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';

// Component
// import HeaderComponent from '../component/HeaderComponent';
// import CustomLoader from '../component/CustomLoader';

// Icon
import trophy from '../assets/game_image/trophy.png';
import pumpkin from '../assets/game_image/pumpkin.png';
import cross from '../assets/game_image/cross.png';
import winner from '../assets/game_image/winner.png';
import checked from '../assets/game_image/checked.png';

// User Preference
import {async_keys, getData} from '../api/UserPreference';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthHeader from '../components/AuthHeader';
import AppLoader from '../provider/AppLoader';

export default class ResultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkResult: null,
      score: null,
      rightAnswer: null,
      wrongAnswer: null,
      resultText: null,
      courageText: null,
      isLoading: true,
      data: {
        quiz_id: 9,
        corret_answer: '4',
        wrong_answer: 1,
        marks: 80,
        result: 'pass',
      },
    };
  }

  componentDidMount() {
    const {route} = this.props;
    const selectedAnswer = route.params.selectedAnswer || [];

    const result = selectedAnswer
      .map(item => ({
        user_answer: item.answer || '',
        correct_option: item.correct_option,
      }))
      .filter(item => item.user_answer);

    this.fetchResult(result);
  }

  fetchResult = async user_answer_params => {
    const quiz_id = await getData(async_keys.active_quiz_id);
    const token = await getData(async_keys.auth_token);

    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify(user_answer_params);

    const requestOption = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${BASE_URL}submit-result/${quiz_id}`, requestOption)
      .then(response => response.json())
      .then(result => {
        console.log({result, requestOption, quiz_id});
        const {Status} = result;
        if (Status === true) {
          // this.setState({data: result?.Data[0] || {}});
          const {
            corret_answer,
            wrong_answer,
            marks,
            result: resultText,
          } = result?.Data;
          const courageText =
            resultText === 'pass' ? 'You did it!' : 'Better luck next time!';
          this.setState({
            checkResult: resultText === 'pass' ? 'Won' : 'Lost',
            score: marks,
            rightAnswer: corret_answer,
            wrongAnswer: wrong_answer,
            resultText: resultText,
            courageText: courageText,
          });
        }
      })
      .catch(e => {
        this.setState({isLoading: false});
      });
    this.setState({isLoading: false});
  };

  handleDone = async () => {
    this.props.navigation.navigate('HomeScreen');
  };

  render() {
    const {isLoading} = this.state;

    // if (isLoading) {
    //   return <CustomLoader />;
    // }

    return (
      <SafeAreaView style={styles.container}>
        <AuthHeader title="Result" />
        <AppLoader loading={isLoading} />

        <View style={styles.homeContainer}>
          <View style={styles.trophyContainer}>
            <Image
              source={this.state.checkResult === 'Won' ? trophy : pumpkin}
              resizeMode="cover"
              style={styles.trophyIcon}
            />

            {this.state.checkResult === 'Won' ? (
              <Text style={styles.congratulationsText}>Congratulations!</Text>
            ) : (
              <Text style={styles.congratulationsText}>Try Again!</Text>
            )}
          </View>

          <Text style={styles.resultText}>{this.state.courageText}</Text>

          <Text style={styles.ratingText}>{this.state.resultText}</Text>

          <Text style={styles.rText}>Results :</Text>

          <View style={styles.resultContainer}>
            <Image
              source={winner}
              resizeMode="cover"
              style={styles.resultIcons}
            />

            <Text style={styles.winnerText}>{this.state.score}</Text>
          </View>

          <View style={styles.resultContainer}>
            <Image
              source={checked}
              resizeMode="cover"
              style={styles.resultIcons}
            />

            <Text style={styles.winnerText}>{this.state.rightAnswer}</Text>
          </View>

          <View style={styles.resultContainer}>
            <Image
              source={cross}
              resizeMode="cover"
              style={styles.resultIcons}
            />

            <Text style={styles.winnerText}>{this.state.wrongAnswer}</Text>
          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.handleDone}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#251c5d',
  },
  homeContainer: {
    flex: 1,
  },
  trophyContainer: {
    height: hp(30),
    width: wp(90),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(2),
    borderRadius: wp(4),
    backgroundColor: '#0f143c',
  },
  trophyIcon: {
    height: hp(20),
    aspectRatio: 1 / 1,
  },
  congratulationsText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
    marginVertical: hp(2),
  },
  resultText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  ratingText: {
    fontSize: wp(8),
    fontWeight: '700',
    color: '#00FF00',
    textAlign: 'center',
    marginTop: hp(2),
  },
  ratingText1: {
    fontSize: wp(8),
    fontWeight: '700',
    color: '#F50000',
    textAlign: 'center',
    marginTop: hp(2),
  },
  rText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: wp(8),
  },
  resultContainer: {
    flexDirection: 'row',
    marginHorizontal: wp(8),
    marginVertical: hp(2),
    alignItems: 'center',
  },
  resultIcons: {
    width: hp(6),
    aspectRatio: 1 / 1,
  },
  winnerText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
    marginLeft: wp(10),
  },
  buttonContainer: {
    height: hp(5),
    width: wp(70),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005db4',
    borderRadius: wp(10),
    marginVertical: hp(2),
  },
  buttonText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
  },
});

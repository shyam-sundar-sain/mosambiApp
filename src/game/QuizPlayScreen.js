/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Component, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import CountDown from 'react-native-countdown-component';
import {ActivityIndicator} from 'react-native-paper';
import {BASE_URL, makeRequest} from '../api/ApiInfo';

export default class QuizPlayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.route?.params?.Data || {},
      selectedAnswer: [],
      visibleQuestionIndex: 0,
      isLoading: false,
    };
  }

  componentDidMount = () => {
    this.setState({
      data: this.props.route?.params?.Data || {},
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  };

  handleBack = () => {
    Alert.alert(
      'Exit Game',
      'Do you want to exit?',
      [
        {
          text: 'No',
          //   onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => this.props.navigation.navigate('HomeScreen'),
        },
      ],
      {cancelable: false},
    );
    return true;
  };

  handleAnswer = (answer, question_id) => {
    const {data, visibleQuestionIndex} = this.state;
    const {question_data = []} = data;
    const {navigation} = this.props;

    const {correct_option = ''} =
      question_data &&
      question_data.filter(item => item.question_id === question_id)[0];

    let selectedAnswer = this.state.selectedAnswer;
    selectedAnswer = [
      ...selectedAnswer,
      {question_id, answer, correct_option, selected: true},
    ];

    this.setState({selectedAnswer: selectedAnswer});

    this.setTimeoutID = setTimeout(() => {
      if (visibleQuestionIndex + 1 === question_data?.length) {
        navigation.navigate('ResultScreen', {selectedAnswer: selectedAnswer});
      } else {
        this.setState({visibleQuestionIndex: visibleQuestionIndex + 1});
      }
    }, 1000);
  };

  render() {
    console.log(this.state.data);
    const {isLoading, data, visibleQuestionIndex, selectedAnswer} = this.state;
    const {question_data, total_time} = data;
    const visibleQuestion =
      question_data && question_data[visibleQuestionIndex];

    const isSelected = selectedAnswer.filter(
      item => item.question_id === visibleQuestion?.question_id,
    )[0]?.selected;

    const isRight =
      selectedAnswer.filter(
        item => item.question_id === visibleQuestion?.question_id,
      )[0]?.answer === visibleQuestion?.correct_option;

    const selectedOption = selectedAnswer.filter(
      item => item.question_id === visibleQuestion?.question_id,
    )[0]?.answer;

    // if (isLoading) {
    //   return <CustomLoader />;
    // }

    return (
      <View style={styles.container}>
        <View style={styles.homeContainer}>
          {isLoading ? (
            <View style={styles.quizContainer}>
              <ActivityIndicator color="#fff" size="large" />
            </View>
          ) : (
            <View style={styles.quizContainer}>
              <View style={styles.questionTimerContainer}>
                <Text style={styles.questionCountText}>
                  Question {visibleQuestionIndex + 1} of {question_data?.length}
                </Text>

                <View style={styles.timeContainer}>
                  <CountDown
                    until={Number(total_time)}
                    size={wp(3)}
                    onFinish={() => {
                      this.props.navigation.navigate('ResultScreen', {
                        selectedAnswer: selectedAnswer,
                      });
                    }}
                    digitStyle={{backgroundColor: 'transparent'}}
                    digitTxtStyle={{
                      color: 'white',
                      fontWeight: '900',
                      fontSize: wp(4),
                    }}
                    timeLabelStyle={{color: 'blue', fontSize: 1}}
                    timeToShow={['M', 'S']}
                    timeLabels={{m: '', s: ''}}
                    showSeparator={true}
                    separatorStyle={{
                      color: 'white',
                      fontWeight: '900',
                      fontSize: wp(4),
                    }}
                    style={{
                      paddingTop: 5.5,
                      paddingBottom: 5.5,
                    }}
                  />
                </View>
              </View>

              <Text style={styles.questionText}>
                {visibleQuestion?.question?.toUpperCase()} ?
              </Text>

              {Object.keys(visibleQuestion?.options || {}).map(item => {
                return (
                  <TouchableOpacity
                    disabled={isSelected}
                    onPress={() =>
                      this.handleAnswer(item, visibleQuestion?.question_id)
                    }
                    style={[
                      isRight
                        ? item === selectedOption
                          ? styles.answerContainer1
                          : styles.answerContainer
                        : item === selectedOption
                        ? styles.answerContainer2
                        : styles.answerContainer,
                    ]}>
                    <Text
                      style={[
                        styles.answerText,
                      ]}>{`${item?.toLowerCase()} :`}</Text>
                    <Text
                      style={[
                        styles.answerText,
                        {flex: 1, textTransform: 'capitalize'},
                      ]}>{`${visibleQuestion?.options[item]}`}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* <View>
              <Text style={styles.endText}>
                The quiz has been ended. Please click submit button to check
                result.
              </Text>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={this.handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View> */}
        </View>
      </View>
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
    justifyContent: 'center',
  },
  quizContainer: {
    height: hp(80),
    width: wp(90),
    alignSelf: 'center',
    borderWidth: 1,
    backgroundColor: '#0f143c',
    borderRadius: wp(4),
    paddingHorizontal: hp(2),
    paddingVertical: hp(4),
    justifyContent: 'center',
  },
  questionTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionCountText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
  },
  questionText: {
    fontSize: wp(5),
    // fontWeight: '700',
    color: '#fff',
    marginVertical: hp(2),
    marginBottom: hp(3),
  },
  timeContainer: {
    height: hp(10),
    width: hp(10),
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    backgroundColor: '#F50000',
  },
  timeContainer1: {
    height: hp(10),
    width: hp(10),
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    backgroundColor: '#EB0000',
  },
  timeContainer2: {
    height: hp(10),
    width: hp(10),
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    backgroundColor: '#E10000',
  },
  timeContainer3: {
    height: hp(10),
    width: hp(10),
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    backgroundColor: '#D70000',
  },
  timeContainer4: {
    height: hp(10),
    width: hp(10),
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    backgroundColor: '#CD0000',
  },
  timeContainer5: {
    height: hp(10),
    width: hp(10),
    borderWidth: 5,
    borderColor: '#fff',
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    backgroundColor: '#C30000',
  },
  timeCount: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
  },
  answerContainer: {
    flexDirection: 'row',
    paddingVertical: hp(2),
    width: wp(80),
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: wp(3),
    marginVertical: hp(2),
  },
  answerContainer1: {
    flexDirection: 'row',
    paddingVertical: hp(2),
    width: wp(80),
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3ad14c',
    backgroundColor: '#3ad14c',
    borderRadius: wp(3),
    marginVertical: hp(2),
  },
  answerContainer2: {
    flexDirection: 'row',
    paddingVertical: hp(2),
    width: wp(80),
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
    backgroundColor: 'red',
    borderRadius: wp(3),
    marginVertical: hp(2),
  },
  answerText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: wp(3),
  },
  answerText1: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#3ad14c',
  },
  buttonContainer: {
    height: hp(5),
    width: wp(70),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#005db4',
    borderRadius: wp(10),
    // marginTop: 'auto',
    marginVertical: hp(2),
  },
  buttonText: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#fff',
  },
  endText: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
});

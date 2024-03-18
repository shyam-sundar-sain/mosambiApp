// /* eslint-disable prettier/prettier */
import React, {useRef, useState, useEffect} from 'react';
import {
  OTPInputContainer,
  SplitBoxText,
  SplitBoxes,
  SplitBoxesFocused,
  SplitOTPBoxesContainer,
  TextInputHidden,
} from './Styles';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const OTPInput = ({
  code,
  setCode,
  maximumLength,
  border,
  autoFill,
  testID,
  setOtpError,
}) => {
  const boxArray = new Array(maximumLength).fill(0);
  const inputRef = useRef();

  const boxDigit = (_, index) => {
    const emptyInput = '';
    const digit = code[index] || emptyInput;

    const isCurrentValue = index === code.length;
    const isLastValue = index === maximumLength - 1;
    const isCodeComplete = code.length === maximumLength;

    const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);

    const isFocus = isInputBoxFocused && isValueFocused ? true : false;

    return (
      <View
        style={
          border
            ? [styles.splitBox2, isFocus && styles.focus2]
            : [styles.splitBox, isFocus && styles.focus]
        }
        key={index}>
        <Text style={styles.otpText}>{digit}</Text>
      </View>
    );
  };

  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

  const handleOnPress = () => {
    if (isInputBoxFocused) {
      Keyboard.dismiss();
      inputRef.current.blur();
    }
    inputRef.current.focus();
    setIsInputBoxFocused(true);
  };

  const handleOnBlur = () => {
    setIsInputBoxFocused(false);
  };

  return (
    <View style={styles.OtpInputContainer}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.splitBoxContainer}
        onPress={handleOnPress}>
        {boxArray.map(boxDigit)}
      </TouchableOpacity>

      <TextInput
        testID={testID}
        style={styles.textInputHidden}
        value={code}
        onChangeText={text => {
          setOtpError(false);
          setCode(text.replace(/[^0-9]/g, ''));
        }}
        maxLength={maximumLength}
        ref={inputRef}
        textContentType="oneTimeCode"
        onBlur={handleOnBlur}
        onFocus={handleOnPress}
        keyboardType="phone-pad"
        autoComplete={autoFill ? 'sms-otp' : 'off'}
        importantForAutofill={autoFill ? 'yes' : 'no'}
      />
    </View>
  );
};

// export default OTPInput;

const styles = StyleSheet.create({
  OtpInputContainer: {
    justifyContent: 'center',
    width: '100%',
    // borderWidth: 1,
  },
  splitBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 10,
    // borderWidth: 1,
  },
  splitBox: {
    borderRadius: 12,
    minWidth: '19%',
    minHeight: '95%',
    // elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {height: 1, width: 0},
    backgroundColor: '#EDEDED',
    bottom: -2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splitBox2: {
    minWidth: '16%',
    minHeight: '75%',
    backgroundColor: '#EDEDED',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    bottom: -2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focus: {
    borderColor: '#EDEDED',
    borderWidth: 2,
    elevation: 5,
  },
  focus2: {
    borderBottomColor: '#EDEDED',
    borderBottomWidth: 2,
    elevation: 5,
  },
  textInputHidden: {
    position: 'absolute',
    opacity: 0,
    zIndex: -999,
  },
  otpText: {
    color: '#000',
    fontFamily: 'Roboto-Regular',
  },
});

// import React, {useRef, useState, useEffect} from 'react';
// import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';

// const OTPInput = ({code, setCode, maximumLength, border}) => {
//   const boxArray = new Array(maximumLength).fill(0);
//   const inputRefs = useRef([]);
//   const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

//   const boxDigit = (_, index) => {
//     const emptyInput = '';
//     const digit = code[index] || emptyInput;

//     const isCurrentValue = index === code.length;
//     const isLastValue = index === maximumLength - 1;
//     const isCodeComplete = code.length === maximumLength;

//     const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);
//     const isFocus = isInputBoxFocused && isValueFocused;

//     useEffect(() => {
//       if (isCurrentValue && isInputBoxFocused) {
//         inputRefs.current[index].focus();
//       }
//     }, [isCurrentValue, isInputBoxFocused]);

//     //HANDLING ON BACK-SPACE PRESS
//     const handleOnKeyPress = ({nativeEvent}) => {
//       if (nativeEvent.key === 'Backspace') {
//         if (index > 0) {
//           const updatedCode = [...code];
//           if (index === maximumLength - 1 && code[index]) {
//         //  console.log('first', code[index]);
//             updatedCode[index] = '';
//           } else {
//         //  console.log('third');
//             updatedCode[index - 1] = '';
//           }
//           setCode(updatedCode.join(''));
//           inputRefs.current[index - 1].focus();
//         } else {
//           setCode('');
//         }
//       }
//     };

//     //HANDLING TEXT CHANGE
//     const handleOnChangeText = text => {
//   //  console.log(text);
//       const updatedCode = [...code];
//       updatedCode[index] = text;

//   //  console.log('in change', updatedCode);
//       setCode(updatedCode.join(''));

//       // if (text.length === 1 && index < maximumLength - 1) {
//       //   inputRefs.current[index + 1].focus();
//       // }

//       if (index < maximumLength - 1 && text.length < maximumLength - 1) {
//         inputRefs.current[index + text.length].focus();
//       } else {
//         inputRefs.current[maximumLength - 1].focus();
//       }
//     };

//     const handleOnFocus = () => {
//       setIsInputBoxFocused(true);

//       // if (index < code.length && code.length < maximumLength - 1) {
//       //   inputRefs.current[code.length].focus();
//       //   console.log('if');
//       // } else if (code.length === maximumLength - 1) {
//       //   console.log('else');

//       //   inputRefs.current[code.length - 1].focus();
//       // }
//     };

//     const handleOnBlur = () => {
//       setIsInputBoxFocused(false);
//     };

//     //HANDLING ON PASTE
//     // const handleOnPaste = event => {
//     //   console.log(event.nativeEvent.text);
//     //   const pastedData = event.nativeEvent.text;
//     //   const otpArray = pastedData.slice(0, maximumLength).split('');
//     //   const updatedCode = otpArray.map((digit, index) => {
//     //     if (index < code.length) {
//     //       return digit;
//     //     }
//     //     return '';
//     //   });
//     //   console.log('in paste', updatedCode);
//     //   // setCode(updatedCode.join(''));
//     //   if (index < maximumLength - 1 && pastedData.length < maximumLength - 1) {
//     //     inputRefs.current[index + pastedData.length].focus();
//     //   } else {
//     //     inputRefs.current[maximumLength - 1].focus();
//     //   }
//     // };

//     return (
//       <TextInput
//         style={[
//           styles.splitBox,
//           border && styles.splitBox2,
//           isFocus && styles.focus,
//           isFocus && border && styles.focus2,
//         ]}
//         key={index}
//         maxLength={index !== 0 ? 1 : maximumLength}
//         value={digit}
//         // onChange={event => handleOnPaste(event)}
//         onChangeText={handleOnChangeText}
//         onKeyPress={handleOnKeyPress}
//         onFocus={handleOnFocus}
//         onBlur={handleOnBlur}
//         keyboardType="numeric"
//         ref={ref => (inputRefs.current[index] = ref)}
//       />
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         activeOpacity={1}
//         style={styles.splitBoxesContainer}
//         onPress={() => inputRefs.current[0]?.focus()}>
//         {boxArray.map(boxDigit)}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     width: '100%',
//   },
//   splitBoxesContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   splitBox: {
//     borderRadius: 5,
//     minWidth: '19%',
//     minHeight: '95%',
//     elevation: 5,
//     shadowOpacity: 0.3,
//     shadowRadius: 3,
//     shadowOffset: {height: 1, width: 0},
//     backgroundColor: '#fff',
//     borderWidth: 0.5,
//     borderColor: '#999',
//     bottom: -2,
//     justifyContent: 'center',
//     textAlign: 'center',
//   },
//   splitBox2: {
//     minWidth: '16%',
//     minHeight: '75%',
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#000',
//     bottom: -2,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   focus: {
//     borderColor: '#f7f1ab',
//     borderWidth: 2,
//   },
//   focus2: {
//     borderBottomColor: '#f7f1ab',
//     borderBottomWidth: 2,
//   },
// });

export default OTPInput;

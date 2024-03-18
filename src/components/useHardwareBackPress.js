import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';

const useHardwareBackPress = handleBack => {
  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBack);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', handleBack);
    }, [handleBack]),
  );
};

export default useHardwareBackPress;

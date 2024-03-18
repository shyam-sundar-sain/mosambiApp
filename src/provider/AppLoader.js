/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
export default function AppLoader({loading}) {
  return (
    <Modal transparent={true} animationType="fade" visible={loading}>
      <View activeOpacity={1} style={styles.container}>
        {/* Your own Custom component view*/}
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color="#E03456" />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#00000090',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  activityIndicatorWrapper: {
    height: 80,
    width: 80,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
});

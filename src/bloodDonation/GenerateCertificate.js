/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react/no-string-refs */
/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ViewShot from 'react-native-view-shot';

// Image
// import logo from '../assets/images/logo.png';
import bloodDonationCertificate from '../assets/donation_images/bloodDonationCertificate.jpg';
import {SafeAreaView} from 'react-native-safe-area-context';
import AuthHeader from '../components/AuthHeader';
import {makeRequest} from '../api/ApiInfo';

export default function GenerateCertificate({navigation, route}) {
  const [imageUri, setImageUri] = useState('');
  const viewShotRefs = useRef();

  useEffect(() => {
    sendCapturedImage();
    console.log(route);
  }, []);

  const sendCapturedImage = async () => {
    const user_id = route.params?.id;

    viewShotRefs.current?.capture().then(uri => {
      setImageUri(`data:image/jpeg;base64,${uri}`);
      try {
        // preparing params
        const params = {
          user_id,
          certificate: 'data:image/jpeg;base64,' + uri,
        };

        const response = makeRequest('certificate', params, true);

        if (response) {
          const {status} = response;

          if (status === 'Success') {
            alert('Uploaded Successfully');
          } else if (status === 'Failure') {
            alert('Something went wrong');
            // do nothing
          }
        }
      } catch (error) {
        console.log(error.message);
        alert('Something went wrong');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader title="Generate Certificate" />

      <ScrollView>
        <View style={styles.homeContainer}>
          <TouchableOpacity activeOpacity={1} style={styles.view}>
            <ViewShot
              ref={viewShotRefs}
              options={{format: 'jpg', quality: 1.0, result: 'base64'}}>
              <ImageBackground
                source={bloodDonationCertificate}
                resizeMode="cover"
                style={styles.certificateImageStyle}>
                <Text style={styles.userCertificateName}>
                  {route.params?.name}
                </Text>
              </ImageBackground>
            </ViewShot>
          </TouchableOpacity>

          <View style={styles.quotesTextContainer}>
            <Text style={styles.quotesText}>
              मिनख-मिनख के काम आए। {'\n'}
              मानवता के हित में रक्तदान कराए।।
            </Text>
          </View>

          {/* <TouchableOpacity style={styles.button} onPress={this.handleDownload}>
            <Text style={styles.downloadCertificateText}>
              Download Certificate
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: wp(5),
    marginVertical: hp(2),
  },
  logoStyle: {
    height: hp(10),
    width: wp(50),
  },
  view: {
    borderRadius: wp(2),
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    padding: 10,
    borderWidth: 1,
  },
  certificateImageStyle: {
    // width: 'auto',
    height: hp(28),
    aspectRatio: 16 / 11,
    elevation: 20,
  },
  userCertificateName: {
    fontSize: wp(3.5),
    fontWeight: '700',
    // textAlign: 'center',
    // fontFamily: 'lucida grande',
    top: hp(14.4),
    left: wp(38),
    color: '#000',
  },
  quotesTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(2),
  },
  quotesText: {
    fontSize: wp(4.5),
    fontWeight: '700',
    color: '#ff4b4c',
  },
  button: {
    height: hp(6),
    width: wp(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff4b4c',
    // marginVertical: hp(2),
    borderWidth: 1,
    borderColor: '#ff4b4c',
    borderRadius: wp(10),
    alignSelf: 'center',
    elevation: 5,
    marginVertical: hp(1),
  },
  downloadCertificateText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    color: '#fff',
  },
});

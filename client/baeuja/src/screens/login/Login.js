// Library import
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native'; // React Native Component
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions'; // Responsive Layout
import axios from 'axios'; // axios
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import * as RNLocalize from 'react-native-localize'; // Localize
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'; // Google Signin
import { useNavigation, CommonActions } from '@react-navigation/native'; // Navigation
import { GOOGLE_API_IOS_CLIENT_ID, GOOGLE_API_ANDROID_CLIENT_ID } from '@env'; // React Native Dotenv
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons

// // 토큰 있는지 검사해서 홈으로 이동시키기
// AsyncStorage.getItem('token', async (error, token) => {
//   try {
//     console.log('Token: ', token);

//     // token이 있을 경우 홈으로 이동
//     if (token) {
//       this.props.navigation.dispatch(
//         CommonActions.navigate('Tabs', {
//           screen: 'Home',
//         })
//       );
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

if (Platform.OS === 'ios') {
  GoogleSignin.configure({
    iosClientId: GOOGLE_API_IOS_CLIENT_ID,
  });
  console.log('iOS GoogleSignin configure');
} else if (Platform.OS === 'android') {
  GoogleSignin.configure({
    webClientId: GOOGLE_API_ANDROID_CLIENT_ID,
  });
  console.log('Android GoogleSignin configure');
}

class Login extends Component {
  componentDidMount() {
    // 스플래쉬

    console.log('Component rendered');
    console.log(Platform.OS);
    // AsyncStorage.clear();
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        console.log('Token: ', token);

        // token이 있을 경우 홈으로 이동
        if (token) {
          this.props.navigation.dispatch(
            CommonActions.reset({ index: 1, routes: [{ name: 'Tabs' }] })
          );

          // this.props.navigation.dispatch(
          //   CommonActions.navigate('Tabs', {
          //     screen: 'Home',
          //   })
          // );
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  // 구글 로그인 함수
  googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {
        user: { email },
      } = await GoogleSignin.signIn();
      console.log(email);
      this.getToken('google', { email });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(error);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(error);
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(error);
        // play services not available or outdated
      } else {
        console.log(error);
        // some other error happened
      }
    }
  };

  // 토큰 가져오는 함수
  getToken = async (authMethod, userinfo) => {
    let config = {};
    // const locale = RNLocalize.getCountry();
    const timezone = RNLocalize.getTimeZone();
    const country = RNLocalize.getCountry();
    const platform = Platform.OS;

    const url = `https://dev.k-peach.io/users`;
    try {
      if (authMethod === 'google') {
        config = {
          method: 'post',
          url,
          data: {
            userinfo: { ...userinfo, timezone, country, platform },
          },
        };
      } else {
        // Platform.OS === 'ios'
        //   ? NativeModules.SettingsManager.settings.AppleLocale ||
        //     NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        //   : NativeModules.I18nManager.localeIdentifier;
        config = {
          method: 'post',
          url,
          data: {
            userinfo: {
              timezone,
              country,
              platform,
            },
          },
        };
      }

      const {
        data: { success, token, isMember, errorMessage },
      } = await axios(config);

      if (!success) {
        AsyncStorage.removeItem('token');
        throw new Error(errorMessage);
      }

      this.saveToken(token);

      this.props.navigation.dispatch(CommonActions.reset({ index: 1, routes: [{ name: 'Tabs' }] }));

      // navigation.dispatch(CommonActions.reset('Tabs', { screen: 'Home' }));
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate('Tabs', { screen: 'Home' })],
      // });
      // this.props.navigation.dispatch(resetAction);

      // this.props.navigation.reset('Tabs', {
      //   screen: 'Home',
      // });
    } catch (error) {
      console.log(error);
    }
  };

  // 토큰 저장하는 함수
  saveToken = (token) => {
    AsyncStorage.setItem('token', token, () => {
      console.log('saved token: ', token);
    });
  };

  // Login 화면 전체 렌더링 (return)
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View>
            <Image
              transitionDuration={1000}
              source={require('../../assets/icons/noBlankLogo.png')}
              style={{ width: 100, height: 100 }}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.textOne}>The Most fun way</Text>
            <Text style={styles.textTwo}>to learn Korean</Text>
            <Text style={styles.textThree}>BAEUJA</Text>
            <Text style={styles.textFour}>Learning Korean with K-Contents</Text>
          </View>
          {/* 구글 로그인 버튼 */}
          <View style={styles.loginBtnContainer}>
            <View>
              <TouchableOpacity onPress={() => this.googleSignIn()}>
                <View style={styles.googleLoginBtn}>
                  <ImageBackground
                    transitionDuration={1000}
                    source={require('../../assets/icons/google.png')}
                    style={{
                      width: responsiveScreenWidth(10),
                      height: responsiveScreenWidth(11),
                    }}
                  >
                    <Text style={styles.googleLoginText}>Sign in with Google</Text>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={styles.guestLoginContainer}
              onPress={() => this.getToken('guest')}
            >
              <Text style={styles.guestLoginText}>Try BAEUJA with guest</Text>
              <Ionicons size={25} name="chevron-forward-outline" color={'#4278A4'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    marginTop: 100,
  },
  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    marginTop: 10,
    height: responsiveScreenHeight(3),
    width: responsiveScreenWidth(70),
    backgroundColor: '#FFFFFF',
  },
  textContainer: {
    marginLeft: 30,
  },
  textOne: {
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#555555',
    fontSize: responsiveFontSize(3),
    marginBottom: 6,
  },
  textTwo: {
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#555555',
    fontSize: responsiveFontSize(3),
    marginBottom: 6,
  },
  textThree: {
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#9388E8',
    fontSize: responsiveFontSize(3),
    marginBottom: 10,
  },
  textFour: {
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#9388E8',
    fontSize: responsiveFontSize(2),
  },
  loginBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
  },
  googleLoginBtn: {
    width: responsiveScreenWidth(50),
    height: responsiveScreenHeight(5),
    marginBottom: responsiveScreenHeight(4),
    backgroundColor: '#3f81EC',
    borderRadius: 10,
  },
  googleLoginText: {
    width: responsiveScreenWidth(40),
    height: responsiveScreenHeight(5),
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '900',
    marginLeft: responsiveScreenWidth(11.5),
    marginTop: responsiveScreenHeight(1.5),
    color: '#FFFFFF',
  },
  guestLoginBtn: {
    width: responsiveScreenWidth(50),
    height: responsiveScreenHeight(5),
    fontSize: responsiveFontSize(2),
    backgroundColor: '#9388E8',
    borderRadius: 10,
  },
  guestLoginText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '900',
    color: '#4278A4',
  },
  guestLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestLoginText2: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '900',
    color: '#9388E8',
  },
});

// Library import
import React, { Component } from 'react'; // React Hooks
import {
  StyleSheet,
  Button,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native'; // React Native Component
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
  useResponsiveHeight,
  useResponsiveWidth,
} from 'react-native-responsive-dimensions'; // Responsive Layout
import axios from 'axios'; // axios
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import * as RNLocalize from 'react-native-localize'; // Localize
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin'; // Google Signin
import { useNavigation, CommonActions } from '@react-navigation/native'; // Navigation
import { GOOGLE_API_IOS_CLIENT_ID } from '@env'; // React Native Dotenv
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons

class Login extends Component {
  componentDidMount() {
    // 스플래쉬
    console.log('Component rendered');
    // AsyncStorage.clear();
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        // token이 있을 경우 홈으로 이동
        if (token) {
          this.props.navigation.dispatch(
            CommonActions.navigate('Tabs', {
              screen: 'Home',
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  // 구글 로그인 함수
  googleSignIn = async () => {
    GoogleSignin.configure({
      iosClientId: GOOGLE_API_IOS_CLIENT_ID,
    });
    try {
      await GoogleSignin.hasPlayServices();
      const {
        user: { email, name },
      } = await GoogleSignin.signIn();
      this.getToken('google', { email, name });

      this.props.navigation.dispatch(
        CommonActions.navigate('Tabs', {
          screen: 'Home',
        })
      );
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  // 토큰 가져오는 함수
  getToken = async (authMethod, userinfo) => {
    let config = {};
    const locale = RNLocalize.getCountry();

    const url = `https://api.k-peach.io/users`;
    try {
      if (authMethod === 'google') {
        config = {
          method: 'post',
          url,
          data: {
            userinfo: { ...userinfo, locale },
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
              locale,
            },
          },
        };
      }
      const {
        data: { success, token, isMember, errorMessage },
      } = await axios(config);

      if (!success) {
        throw new Error(errorMessage);
      }

      this.saveToken(token);

      this.props.navigation.dispatch(
        CommonActions.navigate('Tabs', {
          screen: 'Home',
        })
      );
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
          <View style={styles.loginBtnContainer}>
            <View>
              <TouchableOpacity onPress={() => this.googleSignIn()}>
                <View style={styles.googleLoginBtn}>
                  <ImageBackground
                    transitionDuration={1000}
                    source={require('../../assets/icons/google.png')}
                    style={{ width: 40, height: 43 }}
                  >
                    <Text style={styles.googleLoginText}>Sign in with Google</Text>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={() => this.getToken('guest')}>
                {/* <View style={styles.guestLoginBtn}>
                  <ImageBackground
                    transitionDuration={1000}
                    source={require('../../assets/icons/captureLogo.png')}
                    style={{ width: 40, height: 43, backgroundColor: '#FFFFFF' }}
                  >
                    <Text style={styles.guestLoginText}>Sign in with Guest</Text>
                  </ImageBackground>
                </View> */}

                <Text style={styles.guestLoginText}>Sign in Guest</Text>
                <Ionicons size={30} name="chevron-forward-outline" color={'#9388E8'} />
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#3f81EC',
    borderRadius: 10,
    marginBottom: 30,
  },
  googleLoginText: {
    width: responsiveScreenWidth(40),
    height: responsiveScreenHeight(5),
    fontSize: responsiveFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '900',
    marginLeft: 45,
    marginTop: 12,
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
    width: responsiveScreenWidth(40),
    height: responsiveScreenHeight(5),
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '900',
    color: '#9388E8',
  },
  guestLoginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestLoginText2: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '900',
    color: '#9388E8',
  },
});

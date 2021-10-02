// Library import
import React, { Component } from 'react'; // React Hooks
import { StyleSheet, Button, View, Text } from 'react-native'; // React Native Component
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

class Login extends Component {
  componentDidMount() {
    // 스플래쉬
    console.log('Component rendered');
  }

  googleSignIn = async () => {
    GoogleSignin.configure({
      iosClientId: '983890334644-jgtfh2ue7vbuit6hem38bt96jq5ir52d.apps.googleusercontent.com',
    });
    try {
      await GoogleSignin.hasPlayServices();
      const {
        user: { email, name },
      } = await GoogleSignin.signIn();
      this.getToken('google', { email, name });
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

  getToken = async (authMethod, userinfo) => {
    let config = {};
    const locale = RNLocalize.getCountry();

    const url = `https://api.k-peach.io/auth/${authMethod}`;
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
            locale,
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
    } catch (error) {
      console.log(error);
    }
  };

  saveToken = (token) => {
    AsyncStorage.setItem('token', token, () => {
      console.log('saved token: ', token);
    });
  };

  // LoadLocalStorageData = () => {
  //   AsyncStorage.getItem('nickname', (err, result) => {
  //     console.log(result);
  //   });
  // };

  render() {
    return (
      <View style={styles.textInputContainer}>
        <Text>로그인 화면입니다.</Text>
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          onPress={this.googleSignIn}
        />
        <Button title="Guest" onPress={() => this.getToken('guest')} />
      </View>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    marginTop: 10,
    height: responsiveScreenHeight(3),
    width: responsiveScreenWidth(70),
    backgroundColor: '#ffffff',
  },
});

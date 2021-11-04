// Library import
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'; // Google Signin
import { Platform } from 'react-native'; // React Native Component
import { GOOGLE_API_IOS_CLIENT_ID, GOOGLE_API_ANDROID_CLIENT_ID } from '@env'; // React Native Dotenv

export const googleSigninConfigure = () => {
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

  return GoogleSignin;
};

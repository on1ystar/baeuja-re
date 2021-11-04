/* eslint-disable react/prop-types */

// Library import
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import {
  StyleSheet,
  Button,
  View,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native'; // React Native Component
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe'; // Youtube Player
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
  useResponsiveHeight,
  useResponsiveWidth,
  useResponsiveScreenHeight,
} from 'react-native-responsive-dimensions'; // Responsive layout
import axios from 'axios'; // axios
import Sound from 'react-native-sound'; // React Native Sound (성우 음성 재생)
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player'; // React Native Audio Recorder Player (사용자 음성 녹음 및 재생)
import DocumentPicker from 'react-native-document-picker'; // Document Picker (파일 업로드)
import Icon from 'react-native-vector-icons/AntDesign'; // AntDesign
import Icon2 from 'react-native-vector-icons/Feather'; // Feather
import Icon3 from 'react-native-vector-icons/MaterialIcons'; // MaterialIcons
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import RNFS from 'react-native-fs';
import { useFocusEffect, useIsFocused } from '@react-navigation/native'; // Navigation
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons
import { Divider, Card } from 'react-native-elements'; // Elements
import { useNavigation, CommonActions } from '@react-navigation/native'; // Navigation
import { Picker } from '@react-native-picker/picker'; // React Native Picker
import * as RNLocalize from 'react-native-localize'; // Localize
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'; // Google Signin
import { GOOGLE_API_IOS_CLIENT_ID, GOOGLE_API_ANDROID_CLIENT_ID } from '@env'; // React Native Dotenv
import { googleSigninConfigure } from '../../components/login/googleSignin';

// Data import
import { TIMEZONE_LIST } from './timezone'; // Timezone List
import { COUNTRIES } from './countries';

const Profile = () => {
  const navigation = useNavigation();
  const [randomNumber, setRandomNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('');
  const [roleId, setRoleId] = useState(0);
  const [authToken, setAuthToken] = useState(null);

  // 유저 정보 호출
  const loadProfileData = () => {
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;

        setAuthToken(token);

        const {
          data: { success, user, tokenExpired, errorMessage },
        } = await axios.get(`https://api.k-peach.io/users/777`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(`success : ${success}\nuser: ${user}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting User Detail');

        if (user.email == 'NULL') {
          setEmail('Not registered');
        } else {
          setEmail(user.email);
        }
        setNickname(user.nickname);
        setCountry(user.country);
        setTimezone(user.timezone);
        setRoleId(user.roleId);
        setIsLoading(() => false);

        console.log(user.nickname);
        console.log(user.country);
        console.log(user.timezone);
      } catch (error) {
        console.log(error);
        if (+error.code === 401) {
          // 토큰 삭제
          // 로그인으로 이동
        }
      }
    });
  };

  // 로그아웃
  const onLogout = () => {
    if (roleId === 3) {
      Alert.alert('Hold on!', 'All recorded learning information will be removed Do you agree?', [
        {
          text: 'Cancel',
          onPress: () => null,
        },
        {
          text: 'Confirm',
          onPress: () => {
            AsyncStorage.removeItem('token');
            navigation.dispatch(CommonActions.reset({ index: 1, routes: [{ name: 'Stack' }] }));
          },
        },
      ]);
    } else if (roleId === 2) {
      Alert.alert('Hold on!', 'Are you sure you want to log out?', [
        {
          text: 'Cancel',
          onPress: () => null,
        },
        {
          text: 'Confirm',
          onPress: () => {
            AsyncStorage.removeItem('token');
            navigation.dispatch(CommonActions.reset({ index: 1, routes: [{ name: 'Stack' }] }));
          },
        },
      ]);
    }
  };

  // 이메일 변경 함수
  const onChangeEmail = async () => {
    try {
      const GoogleSignin = googleSigninConfigure();
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const {
        user: { email },
      } = await GoogleSignin.signIn();
      console.log(email);

      const {
        data: { success, user, token, tokenExpired, errorMessage },
      } = await axios.patch(
        `https://api.k-peach.io/users/777?column=email`,
        { updatingValue: email },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (tokenExpired) {
        console.log('tokenExpired');
        // login으로 redirect
      }
      console.log(`success : ${success}\nEmail: ${user.email}`);

      AsyncStorage.setItem('token', token, () => {
        console.log('new token saved !');
      });

      setIsLoading(() => false);

      alert('Successful change!');
      setEmail(user.email);
      setRoleId(user.roleId);
    } catch (error) {
      if (error.response.status === 401) {
        console.log('tokenExpired');
        // login으로 redirect
      }
      if (error.response.status === 409) {
        alert('Duplicate email.\nPlease enter another email.');
      }
      console.log(error);
    }
  };

  // 닉네임 변경 함수
  const onChangeNickname = async () => {
    let changedNickname;

    try {
      if (Platform.OS === 'android') {
        changedNickname = {
          updatingValue: `${nickname}`,
        };
      }

      const {
        data: { success, user, tokenExpired, errorMessage },
      } = await axios.patch(`https://api.k-peach.io/users/777?column=nickname`, changedNickname, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log(`success : ${success}\nNickname: ${user.nickname}`);

      console.log(errorMessage);

      console.log('Success Change User Nickname');
      setNickname(user.nickname);
      setIsLoading(() => false);
      alert('Success!');
    } catch (error) {
      if (error.response.status === 401) {
        console.log('tokenExpired');
        // login으로 redirect
      }
      if (error.response.status === 409) {
        alert('Duplicate nickname.\nPlease enter another nickname.');
      }
      console.log(error);
    }
  };

  // 국가 변경 함수
  const onChangeCountry = async () => {
    let changedCountry;

    try {
      if (Platform.OS === 'android') {
        changedCountry = {
          updatingValue: `${country}`,
        };
      }

      const {
        data: { success, user, tokenExpired, errorMessage },
      } = await axios.patch(`https://api.k-peach.io/users/777?column=country`, changedCountry, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (tokenExpired) {
        console.log('tokenExpired');
        // login으로 redirect
      }

      console.log(`success : ${success}\nCountry: ${user.country}`);

      if (!success) throw new Error(errorMessage);

      console.log('Success Change User Country');

      setCountry(user.country);
      setIsLoading(() => false);
      alert('Country change has been successful');
    } catch (error) {
      console.log(error);
    }
  };

  // 시간대 변경 함수
  const onChangeTimezone = async () => {
    let changedTimezone;
    try {
      if (Platform.OS === 'android') {
        changedTimezone = {
          updatingValue: `${timezone}`,
        };
      }

      const {
        data: { success, user, token, tokenExpired, errorMessage },
      } = await axios.patch(`https://api.k-peach.io/users/777?column=timezone`, changedTimezone, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (tokenExpired) {
        console.log('tokenExpired');
        // login으로 redirect
      }
      console.log(`success : ${success}\n Timezone: ${user.timezone}`);

      if (!success) throw new Error(errorMessage);

      console.log('Success Change User Timezone');

      setTimezone(user.timezone);
      setIsLoading(() => false);
      AsyncStorage.setItem('token', token, () => {
        console.log('new token saved !');
      });
      alert('Timezone change has been successful');
      console.log(`changed Timezome : ${timezone}`);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect
  useEffect(loadProfileData, []);

  // Profile 화면 전체 리턴
  return (
    <View style={styles.container}>
      {isLoading ? (
        <></>
      ) : (
        <View style={styles.container}>
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: responsiveFontSize(2.5), color: '#9388E8' }}>
                Hello, {nickname} 👋
              </Text>
              {roleId == 2 ? (
                <Text style={{ fontSize: responsiveFontSize(2), color: '#000000' }}>
                  You are a Member !
                </Text>
              ) : (
                <Text style={{ fontSize: responsiveFontSize(2), color: '#000000' }}>
                  You are a Guest !
                </Text>
              )}
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => {
                  onLogout();
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    width: responsiveScreenWidth(90),
                  }}
                >
                  <Text style={{ color: '#FF0000', fontSize: responsiveFontSize(1.5) }}>
                    logout
                  </Text>
                  <Ionicons size={20} color={'#FF0000'} name="chevron-forward-outline"></Ionicons>
                </View>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Email 항목 */}
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(40) }}>
                <Text style={{ color: '#9388E8', fontWeight: '700' }}>Email</Text>
                <Text
                  style={{ color: '#000000', marginTop: responsiveScreenHeight(2) }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {email}
                </Text>
              </View>
              <View
                style={{
                  width: responsiveScreenWidth(40),
                  marginLeft: responsiveScreenWidth(15),
                  marginTop: responsiveScreenHeight(2),
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    onChangeEmail();
                  }}
                >
                  {roleId == 2 ? (
                    <Text style={{ color: '#444444', fontSize: responsiveFontSize(1.5) }}></Text>
                  ) : (
                    <Text style={{ color: '#444444', fontSize: responsiveFontSize(1.5) }}>
                      Switch to Google
                    </Text>
                  )}
                  <Ionicons size={20} color={'#444444'} name="chevron-forward-outline"></Ionicons>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Nickname 항목 */}
          <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(40) }}>
                <Text style={{ color: '#9388E8', fontWeight: '700' }}>Nickname</Text>
                {/* <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  {nickname}
                </Text> */}
                <View style={{ marginTop: responsiveScreenHeight(2) }}>
                  <TextInput
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.qnaTitleInput}
                    placeholder="Please enter Nickname..."
                    placeholderTextColor="#444444"
                    value={nickname}
                    onChangeText={(text) => setNickname(text)}
                  ></TextInput>
                </View>
              </View>
              <View
                style={{
                  width: responsiveScreenWidth(40),
                  marginLeft: responsiveScreenWidth(15),
                  marginTop: responsiveScreenHeight(3.5),
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    onChangeNickname();
                  }}
                >
                  <Text style={{ color: '#444444', fontSize: responsiveFontSize(1.5) }}>
                    Change Nickname
                  </Text>
                  <Ionicons size={20} color={'#444444'} name="chevron-forward-outline"></Ionicons>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Country 항목 */}
          <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(40) }}>
                <Text style={{ color: '#9388E8', fontWeight: '700' }}>Country</Text>
                {/* <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  {country}
                </Text> */}
                <View
                  style={{
                    borderColor: '#000000',
                    color: '#000000',
                    paddingBottom: 0,
                    paddingTop: 0,
                    paddingRight: 0,
                    paddingLeft: 0,
                    borderRadius: 10,
                    height: responsiveScreenHeight(6.5),
                    width: responsiveScreenWidth(42),
                  }}
                >
                  <Picker
                    style={{
                      backgroundColor: '#FBFBFB',
                      borderColor: '#000000',
                      color: '#000000',
                      height: responsiveScreenHeight(5),
                      width: responsiveScreenWidth(50),
                      paddingBottom: 0,
                      paddingTop: 0,
                      borderWidth: 1,
                    }}
                    selectedValue={country}
                    onValueChange={(itemValue, itemIndex) => setCountry(itemValue)}
                  >
                    {COUNTRIES.map((nation) => {
                      return (
                        <Picker.Item
                          style={{ fontSize: responsiveFontSize(1.5) }}
                          label={nation.name}
                          value={nation.code}
                          key={nation.name}
                        />
                      );
                    })}
                  </Picker>
                </View>
              </View>
              <View
                style={{
                  width: responsiveScreenWidth(40),
                  marginLeft: responsiveScreenWidth(15),
                  marginTop: responsiveScreenHeight(3.5),
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    onChangeCountry();
                  }}
                >
                  <Text style={{ color: '#444444', fontSize: responsiveFontSize(1.5) }}>
                    Change Country
                  </Text>
                  <Ionicons size={20} color={'#444444'} name="chevron-forward-outline"></Ionicons>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Timezone 항목 */}
          <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(40) }}>
                <Text style={{ color: '#9388E8', fontWeight: '700' }}>Timezone</Text>
                {/* <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  {timezone}
                </Text> */}
                <View
                  style={{
                    borderColor: '#000000',
                    color: '#000000',
                    paddingBottom: 0,
                    paddingTop: 0,
                    paddingRight: 0,
                    paddingLeft: 0,
                    height: responsiveScreenHeight(6.5),
                    width: responsiveScreenWidth(42),
                  }}
                >
                  <Picker
                    style={{
                      backgroundColor: '#FBFBFB',
                      borderColor: '#000000',
                      color: '#000000',
                      height: responsiveScreenHeight(5),
                      width: responsiveScreenWidth(50),
                      paddingBottom: 0,
                      paddingTop: 0,
                      borderWidth: 1,
                    }}
                    selectedValue={timezone}
                    onValueChange={(itemValue, itemIndex) => setTimezone(itemValue)}
                  >
                    {TIMEZONE_LIST.map((timezone) => {
                      return (
                        <Picker.Item
                          style={{ fontSize: responsiveFontSize(1.5) }}
                          label={timezone}
                          value={timezone}
                          key={timezone}
                        />
                      );
                    })}
                  </Picker>
                </View>
              </View>
              <View
                style={{
                  width: responsiveScreenWidth(40),
                  marginLeft: responsiveScreenWidth(15),
                  marginTop: responsiveScreenHeight(3.5),
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    onChangeTimezone();
                  }}
                >
                  <Text style={{ color: '#444444', fontSize: responsiveFontSize(1.5) }}>
                    Change Timezone
                  </Text>
                  <Ionicons size={20} color={'#444444'} name="chevron-forward-outline"></Ionicons>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  qnaTitleInput: {
    borderRadius: 5,
    fontSize: responsiveFontSize(1.6),
    color: '#000000',
    paddingBottom: 0,
    paddingTop: 0,
    height: responsiveScreenHeight(4),
    width: responsiveScreenWidth(40),
    borderWidth: 0.2,
    paddingLeft: responsiveScreenWidth(3),
  },
});

export default Profile;

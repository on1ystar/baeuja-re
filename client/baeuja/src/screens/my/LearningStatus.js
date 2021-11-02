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
import { useNavigation } from '@react-navigation/native'; // Navigation
import { Picker } from '@react-native-picker/picker'; // React Native Picker
import * as RNLocalize from 'react-native-localize'; // Localize

const LearningStatus = () => {
  const navigation = useNavigation();
  const [randomNumber, setRandomNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('');
  const [roleId, setRoleId] = useState(0);

  let changedNickname;
  let changedCountry;

  // 유저 정보 호출
  const loadProfileData = () => {
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: { success, user, tokenExpired, errorMessage },
        } = await axios.get(`https://dev.k-peach.io/users/777`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\nuser: ${user}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting User Detail');

        setEmail(user.email);
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
      }
    });
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
              <Text style={{ fontSize: responsiveFontSize(2.5), color: '#000000' }}>
                Hello {nickname}
              </Text>
            </View>
          </Card>

          {/* 총 학습한 컨텐츠 개수 항목 */}
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(60) }}>
                <Text style={{ color: '#9388E8' }}>Total number of learned contents</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  asdf
                </Text>
              </View>
            </View>
          </Card>

          {/* 총 학습한 유닛 개수 항목 */}
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(60) }}>
                <Text style={{ color: '#9388E8' }}>Total number of units learned</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  asdf
                </Text>
              </View>
            </View>
          </Card>

          {/* 총 학습한 문장 개수 항목 */}
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(60) }}>
                <Text style={{ color: '#9388E8' }}>Total number of sentences learned</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  asdf
                </Text>
              </View>
            </View>
          </Card>

          {/* 총 학습한 단어 개수 항목 */}
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(60) }}>
                <Text style={{ color: '#9388E8' }}>Total number of words learned</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  asdf
                </Text>
              </View>
            </View>
          </Card>

          {/* 내 평균 문장 발화 평가 수준 항목 */}
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(60) }}>
                <Text style={{ color: '#9388E8' }}>My Average Sentence Speech Rating Level</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  asdf
                </Text>
              </View>
            </View>
          </Card>

          {/* 내 평균 단어 발화 평가 수준 항목 */}
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(60) }}>
                <Text style={{ color: '#9388E8' }}>My average word utterance rating level</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  asdf
                </Text>
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
    fontSize: responsiveFontSize(1.5),
    color: '#000000',
    paddingBottom: 0,
    paddingTop: 0,
    height: responsiveScreenHeight(3),
    width: responsiveScreenWidth(40),
    borderWidth: 0.2,
  },
});

export default LearningStatus;

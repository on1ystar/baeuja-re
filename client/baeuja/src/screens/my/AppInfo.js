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

// Q&A 화면 전체 그리는 함수
const AppInfo = () => {
  const [qnaTypes, setQnaTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [randomNumber, setRandomNumber] = useState(Math.random());

  // Q&A Types 불러오기
  const loadQnaTypes = () => {
    // Q&A Type 가져오기
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: { success, qnaTypes, tokenExpired, errorMessage },
        } = await axios.get(`https://dev.k-peach.io/qnas/types`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\n Q&A Types: ${qnaTypes}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting Q&A Types');

        setQnaTypes(qnaTypes);
        setIsLoading(() => false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // useEffect
  useEffect(loadQnaTypes, []);

  // send Qna Screen 전체 렌더링
  return (
    <View style={styles.allContainer}>
      <Text style={styles.selectQnaType}>About BAEUJA</Text>
      {isLoading ? (
        <Text></Text>
      ) : (
        <View style={styles.allContainer}>
          {/* 앱 이름 부분 */}
          <Card
            containerStyle={{
              width: responsiveScreenWidth(90),
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(60) }}>
                <Text style={{ color: '#9388E8' }}>Name</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  BAEUJA
                </Text>
              </View>
            </View>
          </Card>

          {/* 앱 버전 부분 */}
          <Card
            containerStyle={{
              width: responsiveScreenWidth(90),
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(60) }}>
                <Text style={{ color: '#9388E8' }}>Version</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  0.3.2
                </Text>
              </View>
            </View>
          </Card>

          {/* 문의 메일 부분 */}
          <Card
            containerStyle={{
              width: responsiveScreenWidth(90),
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(35) }}>
                <Text style={{ color: '#9388E8' }}>Contact Us</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  yeongstars@gmail.com
                </Text>
              </View>
            </View>
          </Card>

          {/* 이용 약관 부분 */}
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(60) }}>
                <Text style={{ color: '#9388E8' }}>Terms of Use</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  BAEUJA
                </Text>
              </View>
            </View>
          </Card>

          {/* 개인 정보 처리 방침 부분 */}
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(60) }}>
                <Text style={{ color: '#9388E8' }}>Privacy policy</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  BAEUJA
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
  allContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  selectQnaType: {
    marginTop: responsiveScreenHeight(15),
    color: '#000000',
    fontSize: responsiveScreenFontSize(3.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  qnaTypeContainer: {
    justifyContent: 'center',
    marginTop: responsiveScreenHeight(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  qnaTypeText: {
    color: '#000000',
    fontSize: responsiveScreenFontSize(3),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '600',
  },
  bookmarkedKoreanSentences: {
    color: '#000000',
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    marginBottom: responsiveScreenHeight(1),
  },
  bookmarkedSentences: {
    color: '#000000',
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  bookmarkedIconContainer: {
    position: 'absolute',
    right: responsiveScreenWidth(-2),
    top: responsiveScreenHeight(-0.5),
    justifyContent: 'flex-end',
  },
});

export default AppInfo;

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
  Image,
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
import VersionCheck from 'react-native-version-check'; // React Native Version Check

// Q&A 화면 전체 그리는 함수
const AboutUs = () => {
  const [qnaTypes, setQnaTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [randomNumber, setRandomNumber] = useState(Math.random());

  // send Qna Screen 전체 렌더링
  return (
    <View style={styles.allContainer}>
      <View style={styles.allContainer}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: responsiveScreenWidth(100),
          }}
        >
          <Image
            transitionDuration={1000}
            source={require('../../assets/icons/captureLogo.png')}
            style={styles.thumbnailImage}
          />
        </View>
        {/* 앱 이름 부분 */}
        <Card
          containerStyle={{
            width: responsiveScreenWidth(90),
            marginTop: responsiveScreenHeight(5),
            borderWidth: 0,
            borderRadius: 10,
            backgroundColor: '#FBFBFB',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={{ color: '#9388E8' }}>Name</Text>
            </View>
            <View style={{ marginLeft: responsiveScreenWidth(17) }}>
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
            <View>
              <Text style={{ color: '#9388E8' }}>Version</Text>
            </View>
            <View style={{ marginLeft: responsiveScreenWidth(15) }}>
              <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                {VersionCheck.getCurrentVersion()}
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
            <View>
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
        {/* <Card
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
          </Card> */}

        {/* 개인 정보 처리 방침 부분 */}
        {/* <Card
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
          </Card> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
    alignItems: 'center',
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
  thumbnailImage: {
    marginTop: responsiveScreenHeight(10),
    width: responsiveScreenWidth(44),
    height: responsiveScreenHeight(24),
    borderRadius: 10,
  },
});

export default AboutUs;

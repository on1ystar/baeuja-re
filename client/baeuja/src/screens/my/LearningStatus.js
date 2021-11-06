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
  const [countsOfContents, setCountsOfContents] = useState('');
  const [countsOfUnits, setCountsOfUnits] = useState('');
  const [countsOfSentences, setCountsOfSentences] = useState('');
  const [countsOfWords, setCountsOfWords] = useState('');
  const [avarageScoreOfSentences, setAvarageScoreOfSentences] = useState(0);
  const [avarageScoreOfWords, setAvarageScoreOfWords] = useState(0);
  const [authToken, setAuthToken] = useState(null);

  // 유저 학습 정보 호출
  const loadLearningStatus = () => {
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;

        setAuthToken(token);

        const {
          data: { success, learningHistory, tokenExpired, errorMessage },
        } = await axios.get(`https://api.k-peach.io/users/777/learning-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(`success : ${success}\nlearningHistory: ${learningHistory}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting LearningHistory');

        setCountsOfContents(learningHistory.countsOfContents);
        setCountsOfUnits(learningHistory.countsOfUnits);
        setCountsOfSentences(learningHistory.countsOfSentences);
        setCountsOfWords(learningHistory.countsOfWords);
        setAvarageScoreOfSentences(learningHistory.avarageScoreOfSentences);
        setAvarageScoreOfWords(learningHistory.avarageScoreOfWords);
        setIsLoading(() => false);
      } catch (error) {
        console.log(error);
        if (+error.code === 401) {
          // 토큰 삭제
          // 로그인으로 이동
        }
      }
    });
  };

  // useEffect
  useEffect(loadLearningStatus, []);

  let avarageRankOfSentences;
  let avarageRankOfWords;

  if (avarageScoreOfSentences > 85) {
    avarageRankOfSentences = 'A+';
  } else if (avarageScoreOfSentences > 75) {
    avarageRankOfSentences = 'A';
  } else if (avarageScoreOfSentences > 60) {
    avarageRankOfSentences = 'B';
  } else if (avarageScoreOfSentences > 45) {
    avarageRankOfSentences = 'C';
  } else {
    avarageRankOfSentences = 'D';
  }

  if (avarageScoreOfWords > 85) {
    avarageRankOfWords = 'A+';
  } else if (avarageScoreOfWords > 75) {
    avarageRankOfWords = 'A';
  } else if (avarageScoreOfWords > 60) {
    avarageRankOfWords = 'B';
  } else if (avarageScoreOfWords > 45) {
    avarageRankOfWords = 'C';
  } else {
    avarageRankOfWords = 'D';
  }

  // Profile 화면 전체 리턴
  return (
    <View style={styles.container}>
      {isLoading ? (
        <></>
      ) : (
        <View style={styles.container}>
          {/* 총 학습한 컨텐츠 개수 항목 */}
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(62) }}>
                <Text style={{ color: '#000000' }}>Total number of learned contents</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text
                  style={{ color: '#17A2FF', fontWeight: '700' }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {countsOfContents}
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
              <View style={{ width: responsiveScreenWidth(62) }}>
                <Text style={{ color: '#000000' }}>Total number of learned units</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text
                  style={{
                    color: '#17A2FF',
                    fontWeight: '700',
                    fontWeight: '700',
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {countsOfUnits}
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
              <View style={{ width: responsiveScreenWidth(62) }}>
                <Text style={{ color: '#000000' }}>Total number of learned sentences</Text>
              </View>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                onPress={() =>
                  navigation.navigate('Stack', {
                    screen: 'Sentences Review',
                  })
                }
              >
                <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                  <Text
                    style={{ color: '#17A2FF', textDecorationLine: 'underline', fontWeight: '700' }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {countsOfSentences}
                  </Text>
                </View>
                <Ionicons
                  style={{ marginLeft: responsiveScreenWidth(1) }}
                  size={18}
                  color={'#17A2FF'}
                  name="arrow-redo-circle-outline"
                ></Ionicons>
              </TouchableOpacity>
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
              <View style={{ width: responsiveScreenWidth(62) }}>
                <Text style={{ color: '#000000' }}>Total number of learned words</Text>
              </View>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                onPress={() =>
                  navigation.navigate('Stack', {
                    screen: 'Words Review',
                  })
                }
              >
                <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                  <Text
                    style={{ color: '#17A2FF', textDecorationLine: 'underline', fontWeight: '700' }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {countsOfWords}
                  </Text>
                </View>
                <Ionicons
                  style={{ marginLeft: responsiveScreenWidth(1) }}
                  size={18}
                  color={'#17A2FF'}
                  name="arrow-redo-circle-outline"
                ></Ionicons>
              </TouchableOpacity>
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
              <View style={{ width: responsiveScreenWidth(62) }}>
                <Text style={{ color: '#000000' }}>Average of Sentences Speech Rating</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text
                  style={{ color: '#17A2FF', fontWeight: '700' }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {avarageRankOfSentences}
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
              <View style={{ width: responsiveScreenWidth(62) }}>
                <Text style={{ color: '#000000' }}>Average of Words Speech Rating</Text>
              </View>
              <View style={{ marginLeft: responsiveScreenWidth(10) }}>
                <Text
                  style={{ color: '#17A2FF', fontWeight: '700' }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {avarageRankOfWords}
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

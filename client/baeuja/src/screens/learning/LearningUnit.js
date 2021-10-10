/* eslint-disable react/prop-types */

// Library import
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component
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

// Component import
import Script from '../../components/learning/Script';
import Words from '../../components/learning/Words';
import Tools from '../../components/learning/Tools';

// CSS import
import LearningStyles from '../../styles/LearningStyle';

let intervalId;
const LearningUnit = ({
  route: {
    params: { contentId, unitIndex },
  },
}) => {
  // state
  const [unit, setUnit] = useState({});
  const [sentences, setSentences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluationLoading, setIsEvaluationLoading] = useState(true);
  const [evaluatedSentence, setEvaluatedSentence] = useState({});
  const [pitchData, setPitchData] = useState({});
  const [currentSentence, setCurrentSentence] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const youtubeRef = useRef();

  // Unit 화면에서 Unit 데이터와, 서버 통신으로 Unit, Sentences 데이터 받아오기
  const loadUnit = useCallback(async () => {
    console.log(`load unit => contentId : ${contentId}, unitIndex: ${unitIndex}`);

    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: { success, unit, sentences, tokenExpired, errorMessage },
        } = await axios.get(
          `https://api.k-peach.io/learning/contents/${contentId}/units/${unitIndex}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`unit: ${unit}\nsentences: ${sentences}`);

        if (!success) throw new Error(errorMessage);

        console.log('success getting learning unit');
        setUnit(unit);
        setSentences(sentences);
        setIsLoading(() => false);
      } catch (error) {
        console.log(error);
      }
    });
  }, [contentId, unitIndex]);

  const onStateChange = useCallback(
    (state) => {
      if (state === 'playing') {
        setIsPlaying(true);
        // 학습 도구 버튼 비활성화
      }

      if (state === 'paused') {
        setIsPlaying(false);
        // 학습 도구 버튼 활성화
      }

      if (state === 'ended') {
        setIsPlaying(false);
        setIsEnded(true);
      }
      return;
    },
    [youtubeRef.current]
  );

  // -------------------------------------useEffect----------------------------------------
  useEffect(loadUnit, []);

  useEffect(() => {
    // 유튜브 영상 시간 가져오는 인터벌 실행
    intervalId = setInterval(async () => {
      if (isPlaying) {
        const curruentTime = Math.round(await youtubeRef.current.getCurrentTime());
        const filteredSentences = sentences.filter((sentence) => {
          const [sentenceMin, sentenceSec] = sentence.endTime.split(':');
          const sentenceEndTimeToSec = parseInt(sentenceMin) * 60 + parseInt(sentenceSec);
          return curruentTime <= sentenceEndTimeToSec;
        });
        setCurrentSentence(() => filteredSentences[0]);
      } else if (!isPlaying) clearInterval(intervalId);
    }, 100);
    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (isEnded) {
      youtubeRef.current.seekTo(
        parseInt(unit.startTime.split(':')[0]) * 60 + parseInt(unit.startTime.split(':')[1])
      );
      setIsEnded(false);
      setCurrentSentence(sentences[0]);
    }
  }, [isEnded]);

  // -------------------------------------return----------------------------------------
  // Learning 화면 전체 그리기
  return (
    <ScrollView style={LearningStyles.container}>
      {/* 유튜브 플레이어 */}
      {isLoading ? (
        <Text> </Text>
      ) : (
        <View>
          <View>
            <YoutubePlayer
              ref={youtubeRef}
              play={isPlaying}
              videoId={unit.youtubeUrl}
              initialPlayerParams={{
                start:
                  parseInt(unit.startTime.split(':')[0]) * 60 +
                  parseInt(unit.startTime.split(':')[1]),
                end:
                  parseInt(unit.endTime.split(':')[0]) * 60 + parseInt(unit.endTime.split(':')[1]),
                controls: 0,
                modestbranding: 1,
                rel: 0,
              }}
              height={responsiveScreenHeight(26)}
              onChangeState={onStateChange}
              volume={50}
            />
          </View>
          <View>
            {/* 스크립트, 단어 그리기 */}
            {Object.keys(currentSentence).length !== 0 && currentSentence !== undefined ? (
              <Script currentSentence={currentSentence} />
            ) : (
              <Text></Text>
            )}
          </View>
          {/* 학습 도구 모음 부분  */}
          <View style={LearningStyles.learningButtonContainer}>
            {Object.keys(currentSentence).length !== 0 &&
            currentSentence !== undefined &&
            isPlaying === false ? (
              <Tools currentSentence={currentSentence} />
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
      )}

      {/* 발화 평가 차트 */}
    </ScrollView>
  );
};

export default LearningUnit;

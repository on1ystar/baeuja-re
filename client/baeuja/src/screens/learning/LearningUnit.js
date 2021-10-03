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

// CSS import
import LearningStyles from '../../styles/LearningStyle';

let intervalId;
const LearningUnit = ({
  route: {
    params: { contentId, unitIndex },
  },
}) => {
  const DEFAULT_RECOREDED_FILE_NAME = 'sound.m4a';

  // state
  const [unit, setUnit] = useState({});
  const [sentences, setSentences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluationLoading, setIsEvaluationLoading] = useState(true);
  const [evaluatedSentence, setEvaluatedSentence] = useState({});
  const [pitchData, setPitchData] = useState({});
  const [currentSentence, setCurrentSentence] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const youtubeRef = useRef();
  const isFoucsed = useIsFocused();

  const audioRecorderPlayer = new AudioRecorderPlayer();

  // Unit 화면에서 Unit 데이터와, 서버 통신으로 Unit, Sentences 데이터 받아오기
  const loadUnit = async () => {
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
  };

  const onStateChange = (state) => {
    if (state === 'playing') {
      setIsPlaying(() => true);
      // 유튜브 영상 시간 가져오는 인터벌 실행
      intervalId = setInterval(async () => {
        if (youtubeRef.current === null) {
          clearInterval(intervalId);
        } else {
          const curruentTime = Math.round(await youtubeRef.current.getCurrentTime());
          const filteredSentences = sentences.filter((sentence) => {
            const [sentenceMin, sentenceSec] = sentence.endTime.split(':');
            const sentenceEndTimeToSec = parseInt(sentenceMin) * 60 + parseInt(sentenceSec);
            return curruentTime <= sentenceEndTimeToSec;
          });
          setCurrentSentence(() => filteredSentences[0]);
        }
      }, 100);
      // 학습 도구 버튼 비활성화
    }

    if (state === 'paused') {
      setIsPlaying(false);
      // 유튜브 영상 시간 가져오는 인터벌 멈춤
      clearInterval(intervalId);
      // 학습 도구 버튼 활성화
    }

    if (state === 'ended') {
      setIsPlaying(false);
      youtubeRef.current.seekTo(
        parseInt(unit.startTime.split(':')[0]) * 60 + parseInt(unit.startTime.split(':')[1])
      );
      // 유튜브 영상 시간 가져오는 인터벌 멈춤
      clearInterval(intervalId);
      setCurrentSentence(sentences[0].koreanText);
    }
    return;
  };
  // https://github.com/hyochan/react-native-audio-recorder-player

  //유저 음성 녹음 함수
  const onStartRecord = async () => {
    const recoredUserVoice = await audioRecorderPlayer.startRecorder();
    console.log('-------------음성 녹음 결과-------------');
    console.log(`${recoredUserVoice}`);
  };

  //유저 음성 녹음 중지 및 결과 전송 함수
  const onStopRecord = async () => {
    const recoredUserVoice = await audioRecorderPlayer.stopRecorder();
    console.log('-------------음성 녹음 중지-------------');
    console.log(`${recoredUserVoice}`);

    try {
      const path = RNFS.CachesDirectoryPath + `/${DEFAULT_RECOREDED_FILE_NAME}`;
      const formData = new FormData();

      formData.append(
        'userVoice', //업로드할 파일의 폼
        {
          uri: path, //파일 경로
          type: 'audio/m4a', //파일 형식
          name: DEFAULT_RECOREDED_FILE_NAME, //파일 이름
        }
      );
      AsyncStorage.getItem('token', async (error, token) => {
        try {
          if (token === null) {
            // login으로 redirect
          }
          // AsyncStorage error
          if (error) throw error;

          console.log(currentSentence.senteceId);
          const {
            data: { success, evaluatedSentence, pitchData, errorMessage },
          } = await axios.post(
            `https://api.k-peach.io/learning/sentences/${currentSentence.senteceId}/evaluation`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          if (tokenExpired) {
            // login으로 redirect
          }
          console.log(`evaluatedSentence: ${evaluatedSentence}`);

          if (!success) throw new Error(errorMessage);

          console.log('success getting Evaluated Data');
          setEvaluatedSentence(evaluatedSentence);
          setPitchData(pitchData);
          setIsEvaluationLoading(false);
        } catch (error) {
          console.log(error);
        }
      });
    } catch (err) {
      //업로드 취소 error 표시
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  //유저 음성 재생 함수
  const onStartPlay = async () => {
    console.log('음성 재생');
    const msg = await audioRecorderPlayer.startPlayer();
  };

  useEffect(loadUnit, []);
  useEffect(() => {}, [currentSentence]);

  // Learning 화면 전체 그리기
  return (
    <ScrollView style={LearningStyles.container}>
      {/* 유튜브 플레이어 */}
      {isLoading ? (
        <Text> </Text>
      ) : (
        <View>
          <YoutubePlayer
            ref={youtubeRef}
            play={isPlaying}
            videoId={unit.youtubeUrl}
            initialPlayerParams={{
              start:
                parseInt(unit.startTime.split(':')[0]) * 60 +
                parseInt(unit.startTime.split(':')[1]),
              end: parseInt(unit.endTime.split(':')[0]) * 60 + parseInt(unit.endTime.split(':')[1]),
              controls: 0,
              modestbranding: 1,
              rel: 0,
            }}
            height={250}
            onChangeState={onStateChange}
          />
        </View>
      )}
      <View>
        <Script currentSentence={currentSentence} />
      </View>
      {/* 학습 도구 모음 부분  */}
      <View style={LearningStyles.learningButtonContainer}>
        {/* 음성 녹음 버튼 */}
        <TouchableOpacity style={LearningStyles.learningButton}>
          <Icon2
            style={{
              marginTop: 2,
            }}
            name="mic"
            size={27}
            color="#9388E8"
            onPress={() => onStartRecord()}
          />
        </TouchableOpacity>

        {/* 음성 녹음 중지 버튼 */}
        <TouchableOpacity style={LearningStyles.learningButton}>
          <Icon2 name="stop-circle" size={30} color="#9388E8" onPress={() => onStopRecord()} />
        </TouchableOpacity>

        {/* 음성 재생 버튼 */}
        <TouchableOpacity style={LearningStyles.learningButton}>
          <Icon3 name="hearing" size={30} color="#9388E8" onPress={() => onStartPlay()} />
        </TouchableOpacity>
      </View>
      {/* 발화 평가 차트 */}
    </ScrollView>
  );
};

export default LearningUnit;

/**
 * <LearningUnit>
 *  시간, 영상 재생 상태 감지 중
 *  sentences
 *  curruentTime
 *  currentSentenceId
 *  -> youtube
 *    특정 시간에 호출 <DrawScript/> 해당 문장 단어 props로 전달
 *  -> button
 *    <SpeechEvaluationResult/>
 * </LearningUnit>
 *
 * DrawScript
 */
// 현재 시간을 감지하고 있는 setInterval
//  -> 현재 문장을 바꿔

// 현재 문장 아이디 업데이트 함수 -> 현재 시간이 바뀔 때마다 호출되는 함수
// {
//   유튜브 현재 시간을 보고 있어
//   다음 문장이 와야 되냐를 보고
//   외야 될 타이밍에
//   현재 문장을 업데이트 (set)
// }

// 문장을 그리는 컴포넌트(현재 문장 스테이트) -> 현재 문장이 바뀔 때마다 호출 (컴포넌트니까 그냥 setState로 어떤 상태가 바뀌면 어차피 다시 렌더링)
// {
//   현재 문장만 그려주면 됨
// }

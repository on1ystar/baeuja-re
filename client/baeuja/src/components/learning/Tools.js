// Library import
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component
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
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player'; // React Native Audio Recorder Player (사용자 음성 녹음 및 재생)
import axios from 'axios'; // axios
import Sound from 'react-native-sound'; // React Native Sound (성우 음성 재생)
import DocumentPicker from 'react-native-document-picker'; // Document Picker (파일 업로드)
import Icon2 from 'react-native-vector-icons/Feather'; // Feather
import Icon3 from 'react-native-vector-icons/MaterialIcons'; // MaterialIcons
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import * as Progress from 'react-native-progress'; // React Native Progress
import 'react-native-gesture-handler'; // React Native Gesture Handler

// import RNFS from 'react-native-fs'; // React Native File System

// Component import
import SpeechEvaluationResult from './SpeechEvaluationResult';

// CSS import
import LearningStyles from '../../styles/LearningStyle';

const Tools = ({ currentSentence }) => {
  const audioRecorderPlayer = new AudioRecorderPlayer();

  const [isStopped, setIsStopped] = useState(false);
  const [evaluatedSentence, setEvaluatedSentence] = useState(null);
  const [pitchData, setPitchData] = useState(null);
  const [success, setSuccess] = useState(false);

  // 성우 음성 재생
  const onPlayPerfectVoice = async () => {
    const music = new Sound(currentSentence.perfectVoiceUri, '', (error) => {
      if (error) {
        console.log('play failed');
        return;
      }
      console.log('-------------성우 음성 재생-------------');
      music.play(() => {});
    });
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        // AsyncStorage error
        if (error) throw error;
        console.log(currentSentence.sentenceId);
        const {
          data: { success, sentenceHistory },
        } = await axios.post(
          `https://api.k-peach.io/learning/sentences/${currentSentence.sentenceId}/perfect-voice`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //   if (tokenExpired) {
        //     // login으로 redirect
        //   }

        console.log(`perfectVoiceCounts: ${sentenceHistory.perfectVoiceCounts}`);

        if (!success) throw new Error(errorMessage);

        console.log('success getting sentenceHistory Data');
        //   setEvaluatedSentence(evaluatedSentence);
        //   setPitchData(pitchData);
        //   setIsEvaluationLoading(false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 음성 녹음 시작
  const onStartRecord = async () => {
    // setIsStopped(true);
    // setIsListened(true);

    console.log('-------------음성 녹음 시작-------------');
    const recoredUserVoice = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      return;
    });
  };

  // 음성 녹음 중지
  const onStopRecord = async () => {
    const DEFAULT_RECOREDED_FILE_NAME = 'sound.m4a';
    const recoredUserVoice = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    if (recoredUserVoice === 'Already stopped') {
      //
      alert('Please record your the great voice first 🙏');
      console.log('Already stopped');
      return;
    }
    setIsStopped(true);
    console.log(recoredUserVoice);
    console.log('-------------음성 녹음 중지 완료------------');

    try {
      //   var RNFS = require('react-native-fs');
      //   const path = RNFS.CachesDirectoryPath + '/sound.m4a';
      //   console.log(path);
      const formData = new FormData();

      formData.append(
        'userVoice', //업로드할 파일의 폼
        {
          uri: recoredUserVoice, //파일 경로
          type: 'audio/m4a', //파일 형식
          name: DEFAULT_RECOREDED_FILE_NAME, //파일 이름
        }
      );

      AsyncStorage.getItem('token', async (error, token) => {
        // try {
        if (token === null) {
          // login으로 redirect
        }
        // AsyncStorage error
        if (error) throw error;
        // const {
        //   data: { success, evaluatedSentence, pitchData, errorMessage },
        // } =

        await axios
          .post(
            `https://api.k-peach.io/learning/sentences/${currentSentence.sentenceId}/evaluation`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
              data: formData,
            }
          )
          .then(({ data: { success, evaluatedSentence, pitchData, errorMessage } }) => {
            console.log(
              `score: ${evaluatedSentence.score} | evaluatedSentence: ${evaluatedSentence.sttResult}`
            );
            console.log(`pitchData : ${pitchData}`);
            console.log(`pitchData : ${pitchData.userVoice.hz}`);
            console.log(`pitchData : ${pitchData.userVoice.time}`);

            // console.log(`Perfect Voice Hz : ${pitchData.perfectVoice.hz}`);
            setEvaluatedSentence(evaluatedSentence);
            setPitchData(pitchData);
            if (!success) throw new Error(errorMessage);
            console.log('success getting Evaluated Data');
          })
          .catch((error) => {
            console.log(error);
          });

        //   if (tokenExpired) {
        //     // login으로 redirect
        //   }

        // console.log(
        //   `score: ${evaluatedSentence.score} | evaluatedSentence: ${evaluatedSentence.sttResult}`
        // );

        // if (!success) throw new Error(errorMessage);

        // console.log('success getting Evaluated Data');
        //   setEvaluatedSentence(evaluatedSentence);
        //   setPitchData(pitchData);
        //   setIsEvaluationLoading(false);
        // } catch (error) {
        //   console.log(error);
        // }
      });
    } catch (err) {
      //업로드 취소 error 표시
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  // 유저 음성 재생
  const onStartPlay = async () => {
    console.log('-------------유저 음성 재생-------------');

    const msg = await audioRecorderPlayer.startPlayer();
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        // AsyncStorage error
        if (error) throw error;
        const {
          data: { success, sentenceHistory },
        } = await axios.post(
          `https://api.k-peach.io/learning/sentences/${currentSentence.sentenceId}/user-voice`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //   if (tokenExpired) {
        //     // login으로 redirect
        //   }

        console.log(`userVoiceCounts: ${sentenceHistory.userVoiceCounts}`);

        if (!success) throw new Error(errorMessage);

        console.log('success getting sentenceHistory Data');
        //   setEvaluatedSentence(evaluatedSentence);
        //   setPitchData(pitchData);
        //   setIsEvaluationLoading(false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 학습 도구 부분 리턴
  return (
    <View>
      <View style={LearningStyles.learningButtonContainer}>
        {/* 성우 음성 재생 버튼 */}
        <TouchableOpacity
          style={LearningStyles.learningButton}
          onPress={() => {
            onPlayPerfectVoice();
          }}
        >
          <Ionicons name="play-outline" size={30} color="#9388E8" />
        </TouchableOpacity>

        {/* 음성 녹음 버튼 */}
        <TouchableOpacity
          style={LearningStyles.learningButton}
          onPress={() => {
            onStartRecord();
          }}
        >
          <Ionicons name="mic-outline" size={30} color="#9388E8" />
        </TouchableOpacity>

        {/* 음성 녹음 중지 버튼 */}
        <TouchableOpacity style={LearningStyles.learningButton} onPress={onStopRecord}>
          <Ionicons style={{ marginTop: 2 }} name="stop" size={27} color="#9388E8" />
        </TouchableOpacity>

        {/* 음성 재생 버튼 */}
        <TouchableOpacity
          style={LearningStyles.learningButton}
          onPress={() => onStartPlay()}
          disabled={!isStopped}
        >
          <Ionicons style={{ marginTop: 2 }} name="ear-outline" size={27} color="#9388E8" />
        </TouchableOpacity>
      </View>
      <View>
        {isStopped ? (
          evaluatedSentence !== null && pitchData !== null ? (
            <View>
              <SpeechEvaluationResult evaluatedSentence={evaluatedSentence} pitchData={pitchData} />
            </View>
          ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 80 }}>
              <Progress.Circle
                size={80}
                animated={true}
                color={'#9388E8'}
                borderWidth={8}
                strokeCap={'round'}
                indeterminate={true}
              />
            </View>
          )
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default Tools;

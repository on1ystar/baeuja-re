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

const audioRecorderPlayer = new AudioRecorderPlayer();

const Tools = ({ currentSentence }) => {
  const [isMoreThanOneTimeRecord, setIsMoreThanOneTimeRecord] = useState(false);
  const [evaluatedSentence, setEvaluatedSentence] = useState(null);
  const [pitchData, setPitchData] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isPlayPerfectVoice, setIsPlayPerfectVoice] = useState(false);
  const [isRecordingUserVoice, setIsRecordingUserVoice] = useState(false);
  const [isPlayUserVoice, setIsPlayUserVoice] = useState(false);

  // 성우 음성 재생
  const onPlayPerfectVoice = async () => {
    setIsPlayPerfectVoice(true);
    const music = new Sound(currentSentence.perfectVoiceUri, '', (error) => {
      if (error) {
        console.log('play failed');
        return;
      }
      console.log('-------------성우 음성 재생-------------');
      music.play((success) => {
        music.setVolume(150);
        if (success) {
          setIsPlayPerfectVoice(false);
          console.log('성우 음성 재생 종료');
        }
      });
    });

    // 기록 저장
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
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 음성 녹음 시작
  const onStartRecord = async () => {
    console.log('-------------음성 녹음 시작-------------');

    const recoredUserVoice = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      return;
    });
    setIsRecordingUserVoice(!isRecordingUserVoice);
  };

  // 음성 녹음 중지
  const onStopRecord = async () => {
    const DEFAULT_RECOREDED_FILE_NAME = 'sound.m4a';
    const recoredUserVoice = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    if (recoredUserVoice === 'Already stopped') {
      alert('Please record your the great voice first 🙏');
      console.log('Already stopped');
      return;
    }
    setIsRecordingUserVoice(!isRecordingUserVoice);
    setIsMoreThanOneTimeRecord(true);
    console.log(recoredUserVoice);
    console.log('-------------음성 녹음 중지 완료------------');

    try {
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
        if (token === null)
          if (error)
            // login으로 redirect
            // AsyncStorage error
            throw error;

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
            console.log(`pitchData : ${pitchData.userVoice}`);

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
    setIsPlayUserVoice(true);
    const msg = await audioRecorderPlayer.startPlayer();
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.duration === e.currentPosition) setIsPlayUserVoice(false);
    });
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null)
          if (error)
            // login으로 redirect

            // AsyncStorage error
            throw error;

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
        {isPlayPerfectVoice ? (
          <TouchableOpacity
            style={LearningStyles.learningButtonPlay}
            onPress={() => {
              onPlayPerfectVoice();
            }}
            disabled={isPlayPerfectVoice}
          >
            <Ionicons name="volume-medium" size={30} color="#9388E8"></Ionicons>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={LearningStyles.learningButton}
            onPress={() => {
              onPlayPerfectVoice();
            }}
          >
            <Ionicons name="volume-medium-outline" size={30} color="#BBBBBB"></Ionicons>
          </TouchableOpacity>
        )}

        {/* 음성 녹음 버튼 */}
        <TouchableOpacity
          style={LearningStyles.learningButton}
          onPress={() => {
            onStartRecord();
          }}
        >
          <Ionicons name="mic-outline" size={30} color="#BBBBBB" />
        </TouchableOpacity>
        {/* 음성 중지 버튼으로 바뀌는 부분 */}
        <TouchableOpacity
          style={
            isRecordingUserVoice
              ? LearningStyles.learningButtonCover
              : LearningStyles.learningButtonHidden
          }
          onPress={() => {
            onStopRecord();
          }}
        >
          <Ionicons style={{ marginTop: 2 }} name="stop" size={27} color="#9388E8" />
        </TouchableOpacity>

        {/* 유저 음성 재생 버튼 */}
        {isMoreThanOneTimeRecord ? (
          <TouchableOpacity
            style={
              isPlayUserVoice ? LearningStyles.learningButtonPlay : LearningStyles.learningButton
            }
            onPress={() => onStartPlay()}
            disabled={isPlayUserVoice}
          >
            <Ionicons
              style={{ marginTop: 2 }}
              name={isPlayUserVoice ? 'ear' : 'ear-outline'}
              size={27}
              color={isPlayUserVoice ? '#9388E8' : '#BBBBBB'}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={LearningStyles.learningButton}
            onPress={() => onStartPlay()}
            disabled={true}
          >
            <Ionicons style={{ marginTop: 2 }} name="ear-outline" size={27} color="#BBBBBB" />
          </TouchableOpacity>
        )}
      </View>

      {/* 발화 평가 결과 */}
      <View>
        {isMoreThanOneTimeRecord ? (
          evaluatedSentence !== null && pitchData !== null ? (
            <View style={{ marginBottom: 20 }}>
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

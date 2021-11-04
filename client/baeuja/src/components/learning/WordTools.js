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
  Platform,
  PermissionsAndroid,
  Animated,
} from 'react-native'; // React Native Component
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
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'; // React Native Countdown Circle Timer

// import RNFS from 'react-native-fs'; // React Native File System

// Component import
import WordSpeechEvaluationResult from './WordSpeechEvaluationResult';

// CSS import
import LearningStyles from '../../styles/LearningStyle';

const audioRecorderPlayer = new AudioRecorderPlayer();
let userPermission = 'a';

const WordTools = ({ words }) => {
  const [isResponsedEvaluationResult, setIsResponsedEvaluationResult] = useState(false);
  const [evaluatedWord, setEvaluatedWord] = useState(null);
  const [pitchData, setPitchData] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isPlayPerfectVoice, setIsPlayPerfectVoice] = useState(false);
  const [isRecordingUserVoice, setIsRecordingUserVoice] = useState(false);
  const [isPlayUserVoice, setIsPlayUserVoice] = useState(false);
  const [userVoiceScore, setUserVoiceScore] = useState(0);
  const [buttonControl, setButtonControl] = useState(false);

  // 성우 음성 재생
  const onPlayPerfectVoice = async () => {
    setIsPlayPerfectVoice(true);
    setButtonControl(true);
    const music = new Sound(words.perfectVoiceUri, '', (error) => {
      if (error) {
        console.log('play failed');
        return;
      }
      console.log('-------------성우 음성 재생-------------');
      music.play((success) => {
        music.setVolume(150);
        if (success) {
          setIsPlayPerfectVoice(false);
          setButtonControl(false);
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
        console.log(words.wordId);
        const {
          data: { success, wordHistory },
        } = await axios.post(
          `https://api.k-peach.io/learning/words/${words.wordId}/userWordHistory?column=perfectVoiceCounts`,
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

        console.log(`perfectVoiceCounts: ${wordHistory.perfectVoiceCounts}`);

        if (!success) throw new Error(errorMessage);

        console.log('success getting wordHistory Data');
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 권한 요청 함수
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]).then((result) => {
        if (
          result['android.permission.RECORD_AUDIO'] &&
          result['android.permission.WRITE_EXTERNAL_STORAGE'] &&
          result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
        ) {
          userPermission = 'granted';
          savePermission(userPermission);
          console.log('모든 권한 획득');
        } else {
          console.log('권한 거절');
        }
      });
    } else {
    }
  };

  // 권한 저장 함수
  const savePermission = (permission) => {
    AsyncStorage.setItem('permission', permission, () => {
      console.log('saved permission: ', permission);
    });
  };

  // 음성 녹음 시작
  const onStartRecord = async () => {
    // permission 있는지 확인
    AsyncStorage.getItem('permission', async (error, permission) => {
      try {
        console.log('permission: ', permission);

        // permission 있을 경우 음성 녹음
        if (permission) {
          setButtonControl(true);
          console.log('-------------음성 녹음 시작-------------');
          setIsResponsedEvaluationResult(false);
          setPitchData(null);
          setEvaluatedWord(null);
          setIsRecordingUserVoice(true);

          const recoredUserVoice = await audioRecorderPlayer.startRecorder();
          audioRecorderPlayer.addRecordBackListener(async (e) => {
            // e.currentPosition;
            if (e.currentPosition / 1000 > 15) {
              await onStopRecord();
            }
            return;
          });
        } else {
          requestPermission();
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 음성 녹음 중지
  const onStopRecord = async () => {
    setButtonControl(false);
    const DEFAULT_RECOREDED_FILE_NAME_iOS = 'sound.m4a';
    const DEFAULT_RECOREDED_FILE_NAME_Android = 'sound.mp4';
    const recoredUserVoice = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    if (recoredUserVoice === 'Already stopped') {
      alert('Please record your the great voice first 🙏');
      console.log('Already stopped');
      return;
    }
    setIsRecordingUserVoice(false);
    setIsResponsedEvaluationResult(true);
    console.log(recoredUserVoice);
    console.log('-------------음성 녹음 중지 완료------------');

    try {
      const formData = new FormData();

      if (Platform.OS === 'ios') {
        formData.append(
          'userVoice', //업로드할 파일의 폼
          {
            uri: recoredUserVoice, //파일 경로
            type: 'audio/m4a', //파일 형식
            name: DEFAULT_RECOREDED_FILE_NAME_iOS, //파일 이름
          }
        );
        console.log(Platform.OS);
        console.log(formData);
        console.log(formData._parts[0][1]);
      } else if (Platform.OS === 'android') {
        formData.append(
          'userVoice', //업로드할 파일의 폼
          {
            uri: recoredUserVoice, //파일 경로
            type: 'audio/mpeg_4', //파일 형식
            name: DEFAULT_RECOREDED_FILE_NAME_Android, //파일 이름
          }
        );
        console.log(Platform.OS);
        console.log(formData);
        console.log(formData._parts[0][1]);
      }

      AsyncStorage.getItem('token', async (error, token) => {
        // try {
        if (token === null)
          if (error)
            // login으로 redirect
            // AsyncStorage error
            throw error;

        await axios
          .post(
            `https://api.k-peach.io/learning/words/${words.wordId}/userWordEvaluation`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
              data: formData,
            }
          )
          .then(({ data: { success, evaluatedWord, pitchData, errorMessage } }) => {
            console.log(
              `score: ${evaluatedWord.score} | evaluatedWord: ${evaluatedWord.sttResult}`
            );
            console.log(`pitchData : ${pitchData.userVoice}`);

            setEvaluatedWord(evaluatedWord);
            setUserVoiceScore(evaluatedWord.score);
            setPitchData(pitchData);

            // if (!success) throw new Error(errorMessage);
            console.log('success getting Evaluated Data');
          })
          .catch((error) => {
            // console.log(errorMessage);
            setIsResponsedEvaluationResult(false);
            alert('Please record again 🙏');
            console.log(error);
          });

        //   if (tokenExpired) {
        //     // login으로 redirect
        //   }
      });
    } catch (err) {
      console.log(errorMessage);
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
    setButtonControl(true);
    setIsPlayUserVoice(true);
    const msg = await audioRecorderPlayer.startPlayer();
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.duration === e.currentPosition) {
        setIsPlayUserVoice(false);
        setButtonControl(false);
      }
    });
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null)
          if (error)
            // login으로 redirect

            // AsyncStorage error
            throw error;

        const {
          data: { success, wordHistory },
        } = await axios.post(
          `https://api.k-peach.io/learning/words/${words.wordId}/userWordHistory?column=userVoiceCounts`,
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

        console.log(`userVoiceCounts: ${wordHistory.userVoiceCounts}`);

        if (!success) throw new Error(errorMessage);

        console.log('success getting word History Data');
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 학습 도구 부분 리턴
  return (
    <View>
      <View>
        <View style={LearningStyles.learningButtonContainer}>
          {/* 성우 음성 재생 버튼 */}
          {isPlayPerfectVoice ? (
            <TouchableOpacity
              style={LearningStyles.learningButtonPlay}
              onPress={() => {
                onPlayPerfectVoice();
              }}
              disabled={isPlayPerfectVoice || buttonControl}
            >
              <Ionicons name="volume-high-outline" size={30} color="#9388E8"></Ionicons>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={
                buttonControl
                  ? LearningStyles.learningButtondisable
                  : LearningStyles.learningButtonEnable
              }
              onPress={() => {
                onPlayPerfectVoice();
              }}
              disabled={buttonControl}
            >
              <Ionicons
                name="volume-off-outline"
                size={30}
                color={buttonControl ? '#DDDDDD' : '#555555'}
              ></Ionicons>
            </TouchableOpacity>
          )}

          {/* 음성 녹음 버튼 */}
          <TouchableOpacity
            style={
              buttonControl
                ? LearningStyles.learningButtondisable
                : LearningStyles.learningButtonEnable
            }
            onPress={() => {
              onStartRecord();
            }}
            disabled={buttonControl}
          >
            <Ionicons name="mic-outline" size={30} color={buttonControl ? '#DDDDDD' : '#555555'} />
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
          {isResponsedEvaluationResult ? (
            <TouchableOpacity
              style={
                buttonControl
                  ? isPlayUserVoice
                    ? LearningStyles.learningButtonPlay
                    : LearningStyles.learningButtondisable
                  : LearningStyles.learningButtonEnable
              }
              onPress={() => onStartPlay()}
              disabled={buttonControl}
            >
              <Ionicons
                style={{ marginTop: 2 }}
                name={buttonControl ? (isPlayUserVoice ? 'ear' : 'ear-outline') : 'ear-outline'}
                size={27}
                color={buttonControl ? (isPlayUserVoice ? '#9388E8' : '#DDDDDD') : '#555555'}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={LearningStyles.learningButtondisable}
              onPress={() => onStartPlay()}
              disabled={true}
            >
              <Ionicons style={{ marginTop: 2 }} name="ear-outline" size={27} color="#DDDDDD" />
            </TouchableOpacity>
          )}
        </View>

        {/* 음성 녹음 진행 중 타이머 */}
        <View>
          {isRecordingUserVoice ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: responsiveScreenHeight(5),
              }}
            >
              <CountdownCircleTimer
                size={responsiveScreenWidth(30)}
                renderAriaTime={'Hello'}
                strokeWidth={responsiveScreenWidth(2.5)}
                isPlaying
                duration={15}
                initialRemainingTime={15}
                colors={[
                  ['#004777', 0.4],
                  ['#F7B801', 0.4],
                  ['#A30000', 0.2],
                ]}
              >
                {({ remainingTime, animatedColor }) => (
                  <Animated.Text style={{ color: animatedColor }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ color: '#BBBBBB' }}>Recording...</Text>
                      <Text style={{ color: '#BBBBBB' }}>{remainingTime}</Text>
                    </View>
                  </Animated.Text>
                )}
              </CountdownCircleTimer>
            </View>
          ) : (
            <></>
          )}
        </View>

        {/* 발화 평가 결과 */}
        <View>
          {isResponsedEvaluationResult ? (
            evaluatedWord !== null && pitchData !== null ? (
              <View>
                <WordSpeechEvaluationResult evaluatedWord={evaluatedWord} pitchData={pitchData} />
              </View>
            ) : (
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 80 }}>
                <Progress.Circle
                  size={60}
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
    </View>
  );
};

export default WordTools;

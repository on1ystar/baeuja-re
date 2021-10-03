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
import axios from 'axios'; // axios 라이브러리
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

// CSS import
import LearningStyles from '../../styles/LearningStyle';

const LearningUnit = ({
  route: {
    params: { contentId, unitIndex },
  },
}) => {
  // state
  const [unit, setUnit] = useState({});
  const [sentences, setSentences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [evaluatedSentence, setEvaluatedSentence] = useState({});
  const [pitchData, setPitchData] = useState({});

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
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  //유저 음성 녹음 함수
  const onStartRecord = async () => {
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      return;
    });
    console.log('FP-20');
    console.log('음성 녹음 시작');
    console.log(result);
  };

  //유저 음성 녹음 중지 및 결과 전송 함수
  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    console.log('FP-30');
    console.log('음성 녹음 중지');
    console.log(result);

    try {
      var RNFS = require('react-native-fs');

      const path = RNFS.CachesDirectoryPath + '/sound.m4a';
      const formData = new FormData();

      formData.append(
        'userVoice', //업로드할 파일의 폼
        {
          uri: path, //파일 경로
          type: 'audio/m4a', //파일 형식
          name: 'sound.m4a', //파일 이름
        }
      );

      console.log('FORM-DATA');
      console.log(formData);

      axios
        .post(
          //axios를 사용해 post방식으로 파일 전송
          'https://api.k-peach.io/learning/sentences/175/evaluation',
          formData,
          {
            headers: {
              accept: 'application/json',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTYzMjQ4NDYwMiwiZXhwIjoxNjM1MDc2NjAyLCJpc3MiOiJodHRwczovL2FwaS5rLXBlYWNoLmlvIiwic3ViIjoiYmFldWphQXBpVG9rZW4ifQ.Y05gXnmyZRECt-sTHmWHIe7cnFNwU1QY5OphWPibuuY',
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then((response) => {
          //response 응답 (AI에서 받아온 데이터)
          const aiData = response;
          console.log('Response :', aiData);
        })
        .catch((error) => {
          //error 발생 응답
          console.log('Upload Error:', error);
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
    console.log('FP-40');
    console.log('음성 재생');
    const msg = await audioRecorderPlayer.startPlayer();
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener((e) => {
      return;
    });
  };

  useEffect(loadUnit, []);

  // Learning 화면 전체 그리기
  return (
    <ScrollView style={LearningStyles.container}>
      {/* 유튜브 플레이어 */}
      {isLoading ? <Text> </Text> : <YoutubeLyric unit={unit} sentences={sentences} />}
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
// 유튜브 영상 가져오고, 초에 맞는 가사 그리기
const YoutubeLyric = ({ unit, sentences }) => {
  console.log(unit, sentences);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const youtubeRef = useRef();

  // 유튜브 영상 시간 가져오기
  useEffect(() => {
    const interval = setInterval(async () => {
      const videoTime = await youtubeRef.current.getCurrentTime(); // this is a promise. dont forget to await

      setCurrentVideoTime(Math.floor(videoTime));
    }, 100); // 100 ms refresh. increase it if you don't require millisecond precision

    return () => {
      clearInterval(interval);
    };
  }, []);

  // 영상 상태 감지
  const onStateChange = (state) => {
    let sentenceStartTime; // 문장 시작 시간 (ex 1:44)
    let sentenceStartMin; // 문장 시작 분 (ex 1)
    let sentenceStartSec; // 문장 시작 초 (ex 44)

    let sentenceEndTime; // 문장 종료 시간 (ex 2:10)
    let sentenceEndMin; // 문장 종료 분 (ex 2)
    let sentenceEndSec; // 문장 종료 초 (ex 10)

    let sentenceStartPosSec; // 문장 시작 시간 초 환산
    let sentenceEndPosSec; //문장 종료 시간 초 환산

    for (let i = 0; i < sentences.length; i++) {
      // 문장 시작 시간 및 분 초 설정
      sentenceStartTime = sentences[i].startTime.split(':');
      sentenceStartMin = parseInt(sentenceStartTime[0]);
      sentenceStartSec = parseInt(sentenceStartTime[1]);

      // 문장 종료 시간 및 분 초 설정
      sentenceEndTime = sentences[i].endTime.split(':');
      sentenceEndMin = parseInt(sentenceEndTime[0]);
      sentenceEndSec = parseInt(sentenceEndTime[1]);

      // 문장 시작 및 종료 시간 초 환산
      sentenceStartPosSec = sentenceStartMin * 60 + sentenceStartSec;
      sentenceEndPosSec = sentenceEndMin * 60 + sentenceEndSec;

      if (i === sentences.length) {
        return 0;
      } else if (
        state === 'paused' &&
        sentenceStartPosSec <= currentVideoTime &&
        currentVideoTime <= sentenceEndPosSec
      ) {
        // console.log(sentences[i].koreanText);
        // console.log(sentences[i].perfectVoiceUri);
        // perfectVoice = sentences[i].perfectVoiceUri;
        // return perfectVoice;
      } else if (sentences.length < i) {
        return 0;
      } else if (sentences.length - 1 === i) {
        return <Text></Text>;
      }
    }
    // if (state === 'paused') {
    // }
  };

  // 스크립트 그리기
  function DrawScript() {
    let sentenceStartTime; // 문장 시작 시간 (ex 1:44)
    let sentenceStartMin; // 문장 시작 분 (ex 1)
    let sentenceStartSec; // 문장 시작 초 (ex 44)

    let sentenceEndTime; // 문장 종료 시간 (ex 2:10)
    let sentenceEndMin; // 문장 종료 분 (ex 2)
    let sentenceEndSec; // 문장 종료 초 (ex 10)

    let sentenceStartPosSec; // 문장 시작 시간 초 환산
    let sentenceEndPosSec; //문장 종료 시간 초 환산

    let perfectVoice;
    let userVoiceId;

    let Word = []; // 문장 속 단어 저장하는 배열 (ex 문장 : 지금 너를 원하는 내 숨결이 느껴지니? -> 단어 배열 : 지금, now, 원하다, want, 숨, breathing)
    for (let i = 0; i < sentences.length; i++) {
      let WordData = []; // 하나의 문장 속 단어 저장 배열
      for (let j = 0; j < sentences[i].words.length; j++) {
        WordData.push(
          sentences[i].words[j].originalKoreanText, // 문장 속 단어의 한국어 텍스트
          ' : ',
          sentences[i].words[j].originalTranslatedText, // 문장 속 단어의 영어 번역 텍스트
          '\n'
        );
      }
      Word.push(WordData);
    }

    for (let i = 0; i < sentences.length; i++) {
      // 문장 시작 시간 및 분 초 설정
      sentenceStartTime = sentences[i].startTime.split(':');
      sentenceStartMin = parseInt(sentenceStartTime[0]);
      sentenceStartSec = parseInt(sentenceStartTime[1]);

      // 문장 종료 시간 및 분 초 설정
      sentenceEndTime = sentences[i].endTime.split(':');
      sentenceEndMin = parseInt(sentenceEndTime[0]);
      sentenceEndSec = parseInt(sentenceEndTime[1]);

      // 문장 시작 및 종료 시간 초 환산
      sentenceStartPosSec = sentenceStartMin * 60 + sentenceStartSec;
      sentenceEndPosSec = sentenceEndMin * 60 + sentenceEndSec;

      if (i === sentences.length) {
        return 0;
      } else if (sentenceStartPosSec <= currentVideoTime && currentVideoTime <= sentenceEndPosSec) {
        perfectVoice = sentences[i].perfectVoiceUri;
        userVoiceId = sentences[i].sentenceId;

        //사용자 음성 업로드 및 성우 음성 결과 수신
        const uploadVoice = async () => {
          try {
            var RNFS = require('react-native-fs');

            const path = RNFS.CachesDirectoryPath + '/sound.m4a';
            const formData = new FormData();

            formData.append(
              'userVoice', //업로드할 파일의 폼
              {
                uri: path, //파일 경로
                type: 'audio/m4a', //파일 형식
                name: 'sound.m4a', //파일 이름
              }
            );

            console.log('음성 업로드 진행');
            console.log(formData);

            axios
              .post(
                //axios를 사용해 post방식으로 파일 전송
                `https://api.k-peach.io/learning/sentences/${userVoiceId}/evaluation`,
                formData,
                {
                  headers: {
                    accept: 'application/json',
                    Authorization:
                      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTYzMjQ4NDYwMiwiZXhwIjoxNjM1MDc2NjAyLCJpc3MiOiJodHRwczovL2FwaS5rLXBlYWNoLmlvIiwic3ViIjoiYmFldWphQXBpVG9rZW4ifQ.Y05gXnmyZRECt-sTHmWHIe7cnFNwU1QY5OphWPibuuY',
                    'Content-Type': 'multipart/form-data',
                  },
                }
              )
              .then((response) => {
                const perfectVoicePitch = response.data.pitchData.perfectVoice.hz;
                const userVoicePitch = response.data.pitchData.userVoice.hz;
                const userVoiceScore = response.data.evaluatedSentence.score;

                //response 응답 (AI에서 받아온 데이터)
                // const perfectVoicePitch =
                //   response.data.pitchData.perfectVoice.hz;
                // const userVoicePitch = response.data.pitchData.userVoice.hz;
                // const userVoiceScore =
                //   response.data.evaluatedSentence.score;
                // console.log('Response :', perfectVoicePitch);
                // console.log('Response :', userVoicePitch);
                // console.log('Your score :', userVoiceScore);

                return (
                  <View style={YoutubeSentenceStyles.test}>
                    <Text style={YoutubeSentenceStyles.test}>Score : {userVoiceScore}</Text>
                  </View>
                );
              })
              .catch((error) => {
                //error 발생 응답
                console.log('Upload Error:', error);
              });
          } catch (err) {
            //업로드 취소 error 표시
            if (DocumentPicker.isCancel(err)) {
            } else {
              throw err;
            }
          }
        };

        // 성우 음성 재생
        let music = new Sound(perfectVoice, '', (error, sound) => {
          if (error) {
            console.log('성우 음성 재생 실패');
            return;
          }
          try {
            const formData = new FormData();

            formData.append(
              'sentenceHistory', // 전송할 데이터
              {
                userId: 3, // 유저 ID
                sentenceId: 175, // 문장 ID
                perfectVoiceCounts: 1, // 성우 음성 재생 횟수
              }
            );

            axios
              .post(
                //axios를 사용해 post방식으로 파일 전송
                `https://api.k-peach.io/learning/sentences/${userVoiceId}/perfect-voice`,
                formData,
                {
                  headers: {
                    accept: 'application/json',
                    Authorization:
                      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTYzMjQ4NDYwMiwiZXhwIjoxNjM1MDc2NjAyLCJpc3MiOiJodHRwczovL2FwaS5rLXBlYWNoLmlvIiwic3ViIjoiYmFldWphQXBpVG9rZW4ifQ.Y05gXnmyZRECt-sTHmWHIe7cnFNwU1QY5OphWPibuuY',
                  },
                }
              )
              .then((response) => {})
              .catch((error) => {
                //error 발생 응답
                console.log('Upload Error:', error);
              });
          } catch (err) {
            //업로드 취소 error 표시
            if (DocumentPicker.isCancel(err)) {
            } else {
              throw err;
            }
          }
        });

        return (
          <View style={YoutubeSentenceStyles.allContainer}>
            <Text style={YoutubeSentenceStyles.sentence}>
              {sentences[i].koreanText}
              {'\n'}
              {sentences[i].translatedText}
              {'\n'}
            </Text>
            <View style={YoutubeSentenceStyles.wordContainer}>
              <Text style={YoutubeSentenceStyles.word}>{Word[i]}</Text>
            </View>
            <View>
              <TouchableOpacity
                style={LearningStyles.learningButton}
                onPress={() => music.play((onEnd) => {})}
              >
                <Icon name="sound" size={30} color="#9388E8" />
              </TouchableOpacity>
              <TouchableOpacity style={LearningStyles.learningButton} onPress={() => uploadVoice()}>
                <Icon3 name="upload-file" size={30} color="#9388E8" />
              </TouchableOpacity>
            </View>
          </View>
        );
      } else if (sentences.length < i) {
        return 0;
      } else if (sentences.length - 1 === i) {
        return <Text></Text>;
      }
    }

    return <Text></Text>;
  }

  return (
    <View>
      <View>
        <YoutubePlayer
          ref={youtubeRef}
          videoId={unit.youtubeUrl}
          initialPlayerParams={{
            start:
              parseInt(unit.startTime.split(':')[0]) * 60 + parseInt(unit.startTime.split(':')[1]),
            end: parseInt(unit.endTime.split(':')[0]) * 60 + parseInt(unit.endTime.split(':')[1]),
            controls: 0,
            modestbranding: 1,
            rel: 0,
            loop: 1,
          }}
          height={250}
          onChangeState={onStateChange}
        />
      </View>
      {/* <Button title={playing ? 'pause' : 'play'} onPress={togglePlaying} /> */}
      <View>
        <Text>
          <DrawScript />
        </Text>
      </View>
    </View>
  );
};

const YoutubeSentenceStyles = StyleSheet.create({
  allContainer: {
    flex: 1,
  },
  youtubeContainer: {
    flex: 1,
  },
  youtubePlayer: {
    flex: 1,
  },
  sentenceContainer: {
    flex: 1,
    height: responsiveScreenHeight(3),
    backgroundColor: '#000000',
  },
  sentence: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 34,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#555555',
  },
  wordContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  word: {
    flex: 1,
    fontSize: responsiveFontSize(2.3),
  },
  test: {
    flex: 1,
    position: 'absolute',
    zIndex: 99999,
    fontSize: 30,
  },
});

export default LearningUnit;

// Library import
import React, { useState, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart'; // React Native Responsive Linechart (피치 그래프 그리기)
import * as Progress from 'react-native-progress'; // React Native Progress
import 'react-native-gesture-handler'; // React Native Gesture Handler
import { Divider } from 'react-native-elements'; // React Native Elements

// CSS import
import LearningStyles from '../../styles/LearningStyle';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';

const SpeechEvaluationResult = ({ evaluatedSentence, pitchData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [perfectVoiceData, setPerfectVoiceData] = useState([]);
  const [userVoiceData, setUserVoiceData] = useState([]);
  let userScore = evaluatedSentence.score;
  // const [userScore, setUserScore] = useState(evaluatedSentence.score);

  const render = () => {
    let tempPerfectVoiceData = [];
    let tempUserVoiceData = [];
    let perfectVoiceHz = JSON.parse(pitchData.perfectVoice.hz);
    let perfectVoiceTime = JSON.parse(pitchData.perfectVoice.time);
    let userVoiceHz = JSON.parse(pitchData.userVoice.hz);
    let userVoiceTime = JSON.parse(pitchData.userVoice.time);

    for (let i = 0; i < perfectVoiceTime.length; i++) {
      tempPerfectVoiceData.push({ x: perfectVoiceTime[i], y: perfectVoiceHz[i] });
    }
    for (let i = 0; i < userVoiceTime.length; i++) {
      tempUserVoiceData.push({ x: userVoiceTime[i], y: userVoiceHz[i] });
    }
    setPerfectVoiceData(tempPerfectVoiceData);
    setUserVoiceData(tempUserVoiceData);
    // setUserScore(evaluatedSentence.score);
    setIsLoading(false);
  };
  useEffect(render, [pitchData]);

  // 발화평가 결과 받아오기
  return (
    <View>
      {isLoading ? (
        <></>
      ) : (
        <View style={LearningStyles.voiceEvaluationContainer}>
          {/* 발화 평가 등급 */}
          <View style={styles.rankingChart}>
            <Progress.Circle
              size={130}
              animated={true}
              color={'#9388E8'}
              progress={userScore * 0.01}
              thickness={10}
              strokeCap={'round'}
              showsText={true}
              formatText={() => {
                if (userScore > 85) {
                  return 'A+';
                } else if (userScore > 75) {
                  return 'A';
                } else if (userScore > 60) {
                  return 'B';
                } else if (userScore > 45) {
                  return 'C';
                } else {
                  return 'D';
                }
              }}
            />
          </View>

          {/* 발화 평가 피치 그래프 주석 */}
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <View
              style={{
                width: responsiveScreenWidth(75),
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
              }}
            >
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#88E889',
                  fontSize: responsiveFontSize(2),
                  fontWeight: '600',
                }}
              >
                You
              </Text>
              <Text
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#9388E8',
                  fontSize: responsiveFontSize(2),
                  fontWeight: '600',
                }}
              >
                Voice Actor
                {/* <Divider
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: responsiveScreenWidth(10),
                  }}
                  color="#9388E8"
                  width={responsiveScreenHeight(0.5)}
                  orientation="horizontal"
                /> */}
                {/* <Divider
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: responsiveScreenWidth(10),
                    }}
                    color="#88E889"
                    width={responsiveScreenHeight(0.5)}
                    orientation="horizontal"
                  /> */}
              </Text>
            </View>

            {/* 발화 평가 피치 그래프  */}
            <Chart
              style={{ height: 200, width: '80%', backgroundColor: '#FFFFFF' }}
              xDomain={{
                min: 0,
                max:
                  userVoiceData[userVoiceData.length - 1].x >
                  perfectVoiceData[perfectVoiceData.length - 1].x
                    ? userVoiceData[userVoiceData.length - 1].x + 0.5
                    : perfectVoiceData[perfectVoiceData.length - 1].x + 0.5,
              }}
              yDomain={{ min: 0, max: 1 }}
              padding={{
                left: responsiveScreenWidth(5),
                bottom: responsiveScreenHeight(5),
                right: responsiveScreenWidth(5),
              }}
            >
              <VerticalAxis tickValues={[0, 0.2, 0.4, 0.6, 0.8, 1]} />
              <HorizontalAxis tickCount={5} />
              <Line
                data={perfectVoiceData}
                smoothing="cubic-spline"
                theme={{ stroke: { color: '#9388E8', width: 3.5 } }}
              />
              <Line
                data={userVoiceData}
                smoothing="cubic-spline"
                theme={{ stroke: { color: '#88E889', width: 3.5 } }}
              />
            </Chart>
          </View>
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
  rankingChart: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});

export default SpeechEvaluationResult;

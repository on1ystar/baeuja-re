// Library import
import React, { useState, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart'; // React Native Responsive Linechart (피치 그래프 그리기)
import * as Progress from 'react-native-progress'; // React Native Progress
import 'react-native-gesture-handler'; // React Native Gesture Handler
import { Divider, Card } from 'react-native-elements'; // React Native Elements
import { VictoryBar, VictoryChart, VictoryTheme, VictoryLine } from 'victory-native'; // React Native victory-native
// import {
//   VictoryPie,
//   VictoryTooltip,
//   VictoryLabel,
//   VictoryChart,
//   VictoryScatter,
//   VictoryTheme,
//   VictoryLine,
// } from '../../../victory';

// CSS import
import LearningStyles from '../../styles/LearningStyle';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons

const SpeechEvaluationResult = ({ evaluatedSentence, pitchData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [perfectVoiceData, setPerfectVoiceData] = useState([]);
  const [userVoiceData, setUserVoiceData] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  let userScore = evaluatedSentence.score;
  // const [userScore, setUserScore] = useState(evaluatedSentence.score);

  // STT 결과 데이터 생성 함수
  const setCorrectDataOfResult = () => {
    const correctTextWords = evaluatedSentence.correctText.split(' ');
    const sttResultWords = evaluatedSentence.sttResult.trim().split(' ');
    let tempWords = [];
    correctTextWords.forEach((word, index) => {
      if (word === sttResultWords[index])
        tempWords.push(
          <Text
            key={index}
            style={{
              fontSize: responsiveFontSize(2.1),
              fontWeight: '700',
              color: '#484848',
            }}
          >
            [{word}]
          </Text>,
          ' '
        );
    });
    setCorrectWords(tempWords);
    const correctTextLetters = evaluatedSentence.correctText.split('');
    let sttResultLetters = evaluatedSentence.sttResult.trim().split('');
    let tempLetters = [];
    correctTextLetters.forEach((letter, index) => {
      if (letter !== ' ') {
        const finded = sttResultLetters.find((e) => {
          return e === letter;
        });
        if (typeof finded !== 'undefined') {
          tempLetters.push(
            <Text
              key={index}
              style={{
                fontSize: responsiveFontSize(2.1),
                fontWeight: '700',
                color: '#484848',
                backgroundColor: '#CBFFCE',
              }}
            >
              {letter}
            </Text>
          );
          sttResultLetters = sttResultLetters
            .slice(0, sttResultLetters.indexOf(finded))
            .concat(sttResultLetters.slice(sttResultLetters.indexOf(finded) + 1));
        } else {
          tempLetters.push(
            <Text
              key={index}
              style={{
                fontSize: responsiveFontSize(2.1),
                fontWeight: '700',
                color: '#484848',
                backgroundColor: '#FFB6B6',
              }}
            >
              {letter}
            </Text>
          );
        }
      } else {
        tempLetters.push(
          <Text
            key={index}
            style={{
              fontWeight: '700',
              fontSize: responsiveFontSize(2.1),
              color: '#484848',
            }}
          >
            {' '}
          </Text>
        );
      }
    });
    setCorrectLetters(tempLetters);
  };

  // 피치 그래프 그리는 데이터 생성하는 함수
  const setLineChartData = () => {
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
  useEffect(setLineChartData, [pitchData]);
  useEffect(setCorrectDataOfResult, [evaluatedSentence]);

  // 발화평가 결과 받아오기
  return (
    <View style={{ marginBottom: responsiveScreenHeight(2) }}>
      {isLoading ? (
        <></>
      ) : (
        <View style={LearningStyles.voiceEvaluationContainer}>
          {/* 발화 평가 등급 */}
          <Card
            containerStyle={{
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
              marginTop: responsiveScreenHeight(4),
            }}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  color: '#444444',
                  marginTop: responsiveScreenHeight(1),
                  fontSize: responsiveFontSize(2.3),
                  fontWeight: '700',
                }}
              >
                Your speech level
              </Text>
            </View>
            <View style={styles.rankingChart}>
              <Progress.Circle
                size={responsiveScreenWidth(35)}
                borderWidth={3}
                animated={true}
                color={'#9388E8'}
                progress={userScore * 0.01}
                thickness={10}
                strokeCap={'round'}
                showsText={true}
                formatText={() => {
                  if (userScore > 85) {
                    return (
                      <View style={styles.rankingContainer}>
                        <Text style={styles.rankingText}>Rank</Text>
                        <Text style={styles.rankingResultText}>A+</Text>
                      </View>
                    );
                  } else if (userScore > 75) {
                    return (
                      <View style={styles.rankingContainer}>
                        <Text style={styles.rankingText}>Rank</Text>
                        <Text style={styles.rankingResultText}>A</Text>
                      </View>
                    );
                  } else if (userScore > 60) {
                    return (
                      <View style={styles.rankingContainer}>
                        <Text style={styles.rankingText}>Rank</Text>
                        <Text style={styles.rankingResultText}>B</Text>
                      </View>
                    );
                  } else if (userScore > 45) {
                    return (
                      <View style={styles.rankingContainer}>
                        <Text style={styles.rankingText}>Rank</Text>
                        <Text style={styles.rankingResultText}>C</Text>
                      </View>
                    );
                  } else {
                    return (
                      <View style={styles.rankingContainer}>
                        <Text style={styles.rankingText}>Rank</Text>
                        <Text style={styles.rankingResultText}>D</Text>
                      </View>
                    );
                  }
                }}
              />
              {/* <Divider
              style={{
                width: '15%',
                shadowColor: '#000000',
                shadowOffset: {
                  width: 30,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 15,

                elevation: 5,
              }}
              color="#FFFEEE"
              insetType="middle"
              width={1}
              orientation="horizontal"
            /> */}
              <View
                style={{
                  width: responsiveScreenWidth(5),
                  marginTop: responsiveScreenHeight(0.5),
                  height: responsiveScreenHeight(0.5),
                  backgroundColor: '#000000',
                  opacity: 0.15,
                  borderRadius: 10,
                }}
              ></View>
            </View>
            <View
              style={{
                marginTop: responsiveScreenHeight(2),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Correct Words 부분 */}
              {/* <Text
              style={{
                fontWeight: '700',
                fontSize: responsiveFontSize(2.2),
                color: '#484848',
                marginBottom: responsiveScreenHeight(1),
              }}
            >
              ✅ Correct Words{'\n'}
              <Text>{correctWords}</Text>
            </Text> */}
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: responsiveFontSize(2.2),
                  color: '#484848',
                }}
              >
                {/* <Ionicons name="checkmark-circle-outline" color={'#CBFFCE'} size={18}></Ionicons>{' '} */}
                Letters Checking
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: responsiveFontSize(2.2),
                  color: '#484848',
                }}
              >
                [ {correctLetters} ]
              </Text>
            </View>
          </Card>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Divider
              style={{
                width: '80%',
                marginTop: responsiveScreenHeight(2),
              }}
              color="#EEEEEE"
              insetType="middle"
              width={4}
              orientation="horizontal"
            />
          </View>
          <View
            style={{
              width: responsiveScreenWidth(99),
            }}
          >
            <Card containerStyle={{ borderWidth: 1, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{
                    color: '#444444',
                    marginTop: responsiveScreenHeight(1),
                    fontSize: responsiveFontSize(2.3),
                    fontWeight: '700',
                  }}
                >
                  Pitch graph
                </Text>
              </View>
              <View
                style={{
                  marginTop: responsiveScreenHeight(2),
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  marginRight: responsiveScreenWidth(15),
                  marginBottom: 0,
                  paddingBottom: 0,
                }}
              >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#444444' }}>Voice Actor </Text>
                  <Divider
                    style={{
                      width: '12%',
                    }}
                    color="#9388E8"
                    insetType="middle"
                    width={4}
                    orientation="horizontal"
                  />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#444444' }}>You </Text>
                  <Divider
                    style={{
                      width: '12%',
                    }}
                    color="#88E889"
                    insetType="middle"
                    width={4}
                    orientation="horizontal"
                  />
                </View>
              </View>
              <View style={styles.chartContainer}>
                <VictoryChart
                  style={{ backgroundColor: '#FFFFFF', marginTop: responsiveScreenHeight(0) }}
                  width={responsiveScreenWidth(90)}
                  height={responsiveScreenHeight(30)}
                  theme={VictoryTheme.material}
                >
                  <VictoryLine
                    style={{
                      data: { stroke: '#9388E8', strokeWidth: 3 },
                    }}
                    data={perfectVoiceData}
                  />
                  <VictoryLine
                    style={{
                      data: { stroke: '#88E889', strokeWidth: 3 },
                    }}
                    data={userVoiceData}
                  />
                </VictoryChart>
              </View>
            </Card>
          </View>
        </View>
      )}
    </View>
  );
};

{
  /* 발화 평가 피치 그래프 주석 */
}
{
  /* <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
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
                
              </Text>
            </View> */
}

{
  /* 발화 평가 피치 그래프  */
}
{
  /* <Chart
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
        </View> */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  voiceEvaluationContainer: {
    marginBottom: responsiveScreenHeight(2),
    width: responsiveScreenWidth(99),
  },
  rankingChart: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveScreenHeight(3),
  },
  rankingContainer: { justifyContent: 'center', alignItems: 'center' },
  rankingText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: responsiveScreenFontSize(2.5),
    fontWeight: '700',
    color: '#9388E8',
  },
  rankingResultText: {
    fontSize: responsiveScreenFontSize(2.7),
    fontWeight: '700',
    color: '#9388E8',
  },
  chartContainer: {
    flex: 1,
    height: responsiveScreenHeight(20),
    marginBottom: responsiveScreenHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SpeechEvaluationResult;

// Library import
import React, { useState, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart'; // React Native Responsive Linechart (피치 그래프 그리기)
import * as Progress from 'react-native-progress'; // React Native Progress
import 'react-native-gesture-handler'; // React Native Gesture Handler
import { Divider, Card } from 'react-native-elements'; // React Native Elements
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
// CSS import

import LearningStyles from '../../styles/LearningStyle';

const WordSpeechEvaluationResult = ({ evaluatedWord }) => {
  const [isLoading, setIsLoading] = useState(true);
  let userScore = evaluatedWord.score;
  let progress;
  if (userScore == 0) {
    progress = 0;
  } else {
    progress = (userScore * 0.01) / 0.8;
  }

  const render = () => {
    setIsLoading(false);
  };

  useEffect(render, [evaluatedWord.score]);

  // 발화평가 결과 받아오기
  return (
    <View>
      {isLoading ? (
        <></>
      ) : (
        <View style={{ marginTop: responsiveScreenHeight(2) }}>
          {/* 발화 평가 등급 */}
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
                Your speech level
              </Text>
            </View>
            <View style={styles.rankingChart}>
              {console.log('Word Speech Evaluation Result user Score :', userScore)}
              <Progress.Circle
                size={130}
                animated={true}
                color={'#9388E8'}
                progress={progress}
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
          </Card>

          {/* 발화 평가 피치 그래프 주석 */}
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
    marginTop: responsiveScreenHeight(2),
    marginBottom: responsiveScreenHeight(2),
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

/**
 * <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <View>
              <Text>
                <Divider
                  style={{ width: '5%', margin: 20 }}
                  color="#9388E8"
                  subHeader="Voice Actor"
                  width={3}
                  orientation="horizontal"
                />
                {'    '}
                <Divider
                  style={{ width: '5%', margin: 20 }}
                  color="#88E889"
                  subHeader="You"
                  width={3}
                  orientation="horizontal"
                />
              </Text>
            </View>

            발화 평가 피치 그래프  
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
              padding={{ left: 20, top: 10, bottom: 10, right: 10 }}
            >
              <VerticalAxis tickValues={[0, 4, 8, 12, 16, 20]} />
              <HorizontalAxis tickCount={3} />
              <Line
                data={perfectVoiceData}
                smoothing="cubic-spline"
                theme={{ stroke: { color: '#9388E8', width: 3 } }}
              />
              <Line
                data={userVoiceData}
                smoothing="cubic-spline"
                theme={{ stroke: { color: '#88E889', width: 3 } }}
              />
            </Chart>
          </View>
 */
export default WordSpeechEvaluationResult;

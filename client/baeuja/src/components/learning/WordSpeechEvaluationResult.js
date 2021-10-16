// Library import
import React, { useState, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart'; // React Native Responsive Linechart (피치 그래프 그리기)
import * as Progress from 'react-native-progress'; // React Native Progress
import 'react-native-gesture-handler'; // React Native Gesture Handler
import { Divider } from 'react-native-elements'; // React Native Elements
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage

// CSS import
import LearningStyles from '../../styles/LearningStyle';
import {
  responsiveScreenHeight,
  useResponsiveScreenHeight,
} from 'react-native-responsive-dimensions';

const WordSpeechEvaluationResult = ({ evaluatedWord }) => {
  const [isLoading, setIsLoading] = useState(true);
  let userScore = evaluatedWord.score;
  let progress = userScore * 0.01;

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
        <View>
          {/* 발화 평가 등급 */}
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
                console.log('form Text user Score', userScore);
                if (userScore > 70) {
                  return 'A+';
                } else if (userScore > 57) {
                  return 'A';
                } else if (userScore > 45) {
                  return 'B';
                } else if (userScore > 30) {
                  return 'C';
                } else {
                  return 'D';
                }
              }}
            />
          </View>

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
    marginTop: responsiveScreenHeight(10),
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

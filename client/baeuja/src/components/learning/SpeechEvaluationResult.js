// Library import
import React, { useState, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart'; // React Native Responsive Linechart (피치 그래프 그리기)
import * as Progress from 'react-native-progress'; // React Native Progress
import 'react-native-gesture-handler'; // React Native Gesture Handler
import { Divider } from 'react-native-elements'; // React Native Elements

// CSS import
import LearningStyles from '../../styles/LearningStyle';

const SpeechEvaluationResult = ({ evaluatedSentence, pitchData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [perfectVoiceData, setPerfectVoiceData] = useState([]);
  const [userVoiceData, setUserVoiceData] = useState([]);
  let userScore = evaluatedSentence.score;

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
              size={150}
              animated={true}
              color={'#9388E8'}
              progress={userScore * 0.01}
              thickness={10}
              strokeCap={'round'}
              showsText={true}
              formatText={(progress) => {
                if (progress * 100 > 85) {
                  return 'A+';
                } else if (progress * 100 > 75) {
                  return 'A';
                } else if (progress * 100 > 60) {
                  return 'B';
                } else if (progress * 100 > 45) {
                  return 'C';
                } else {
                  return 'D';
                }
              }}
            />
          </View>

          {/* 발화 평가 피치 그래프 주석 */}
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
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

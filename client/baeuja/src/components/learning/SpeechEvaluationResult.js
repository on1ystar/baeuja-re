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

  // const data1 = [
  //   { x: -2, y: 1 },
  //   { x: -1, y: 0 },
  //   { x: 8, y: 13 },
  //   { x: 9, y: 11.5 },
  //   { x: 10, y: 12 },
  // ];

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
                if (progress * 100 > 90) {
                  return 'A+';
                } else if (progress * 100 > 80) {
                  return 'A';
                } else if (progress * 100 > 60) {
                  return 'B';
                } else if (progress * 100 > 30) {
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

/**
 *
 * useEffect -> 빈 배열 -> 리 랜더링 될 때마다 호출
 *    effect 함수를 만드는 거야 (첫 번째 들어가는 그 함수)
 *    처음 컴포넌트가 마운트 될 때 험수를 만들었어 (그때 있었던 그 값들을 가지고, 예를 들어 props들, state들...) -> 어딘가의 메모리에
 *    다음 컴포넌트가 리 랜더링 되니까 다시 호출할꺼잖아?
 *    근데 호출은 다시 하는데 선언은 다시 안해
 *    이전에 선언헀던 함수를 그냥 다시 호출할 뿐
 *
 * useEffect -> 빈 배열  x -> 처음 호출하고, 배열 안에 있는 값이 업데이트 될 때 호출
 *    컴포넌틈 최초 랜더링 시 얘도 처음에 함수를 만들어
 *    애초에 리 랜더링 시에 호출도 안돼
 *    근데 얘는 그 배열에 있는 새끼들을 지켜보고 있다가, 얘들이 바뀌잖아? 변덕을 부리면
 *    그러면 선언했던 그 구조를 뜯어서 최신 애들로 바꿔주고 그 때 호출 <-- 이 부분에서 사기라는 거네 거의 최신 값을 알아야되는 ^ㅐ끼들을 정확하게 보고있다가 다시 그려주니까
 *    물론 지금 이 개념이 정확하게 지금 들어 맞는지 아니 맞는다고 생각을 하고 넘어가야될거같아 이게
 *
 *
 *
 *    그니까 예를 들어 아까 그 상황에서
 *    빈 배열일 때
 *    우리가 setState로 호출했을 때 이게 함수가 실행된 건 맞아 (useEffect가) 심지어 setState때문에 리 랜더링도 했을 꺼야
 *    근데 멈춰있는 것처럼 보인 이유는? 애초에 setState를 하는 값들이 변하지 않았거든
 *    똑같은걸 그리고 있던거
 *
 *    두 번째
 *    score를 넣었을 때
 *    이 결과는 역시 score가 바뀌어가지고 어? 변덕을 부리네? 재 선언 하면서 호출도 했어
 *    그 결과 setState때문에 리 랜더링도 됐어
 *    근데 막상 pitchData는 안바껴있어서 그래프도 똑같은 걸 그려버렸어 <-- 이 이유가 useEffect 안에 있던 값이 Score가 아니라 pitchData니까 영향을 안받는거지
 *    사실상 빈 배열 넣었을 때랑 별반 차이 없다 이말이야 그치?
 *    근데 위에 setState 덕분에 어부지리로 score는 업데이트 된 걸로 바껴서 그려짐
 *
 *    근데 여기서 응용문제
 *    그럼 왜 한 박자 늦게 바뀌는건 뭔 지랄일까
 *    이거에 대한 해답은 이미 우리가 알고있다
 *    뭐냐? 한 번 말해봐라
 *    내 경우를 한 번 이야기 해줄까?
 *    내 경우엔 말이야 우리가 길게 녹음하고 그다음 짧게 녹음을 했는데 일단 안바뀌고
 *    그 다음번에 녹음했을 때 바뀌었단말이지? 근데 이게 그 녹음 결과가 아니라 이전에 쌓여있던 한 번 씹혔던 그놈이 그려진거야
 *    그러면 무조건 밀린거네
 *    이 이유가 뭐 일 것 같냐?
 *    이 이후는 너한테 맡길게
 *    아니 근데 내 예상이랑 좀 다른게
 *    일단 나는 이렇게 생각을 해봤어
 *    우리가 pitchData를 set 하는게 여기가 아니라,
 *    이거보다 한 단계 위에 컴포넌트잖아? Tools인데
 *    여기서 이미 바뀐 pitchData로 set 해줬어
 *    근데, 우리가 useEffect가 빈 배열일 때 씹혔냐 아니면 score일 때 씹혔냐?
 *    일단 어찌됐건 pitchData 일때는 절대 아니야 무조건 잘되니까
 *    저 두 경우라고 그럼 가정하면,
 *    아니 근데 씹히는게 애초에 개웃긴 상황인데 하 참
 *    걍 ㅈ 버그 아니야?
 *    그냥 그 이전 단계에서 set 해주고,
 *
 *  */

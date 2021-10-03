// Library import
import React, { useState, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart'; // React Native Responsive Linechart (피치 그래프 그리기)

// CSS import
import LearningStyles from '../../styles/LearningStyle';

const SpeechEvaluationResult = () => {
  // 발화평가 결과 받아오기
  return (
    <View style={LearningStyles.voiceEvaluationContainer}>
      <View>
        {/* aiData로 교체 */}
        <Text>Your Score : 99</Text>
      </View>
      <Chart
        style={{ height: 200, width: '100%', marginTop: 100 }}
        padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
        xDomain={{ min: 1, max: 5 }}
        yDomain={{ min: 0, max: 1 }}
      >
        <VerticalAxis
          tickValues={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]}
          theme={{
            axis: { stroke: { color: '#aaa', width: 2 } },
            ticks: { stroke: { color: '#aaa', width: 2 } },
            // labels: {formatter: (v: number) => v.toFixed(2)},
          }}
        />
        <HorizontalAxis
          tickCount={10}
          theme={{
            axis: { stroke: { color: '#aaa', width: 2 } },
            ticks: { stroke: { color: '#aaa', width: 2 } },
            labels: { label: { rotation: 50 }, formatter: (v) => v.toFixed(1) },
          }}
        />

        {/* aiData로 교체 */}
        <Line
          data={data1}
          smoothing="bezier"
          tension={0.3}
          theme={{
            stroke: { color: 'green', width: 5 },
            scatter: {
              default: { width: 10, height: 10, rx: 5, color: 'black' },
            },
          }}
        />

        {/* aiData로 교체 */}
        <Line
          data={data2}
          smoothing="bezier"
          tension={0.3}
          theme={{
            stroke: { color: 'red', width: 5 },
            scatter: {
              default: { width: 10, height: 10, rx: 5, color: 'black' },
            },
          }}
        />
      </Chart>
    </View>
  );
};

export default SpeechEvaluationResult;

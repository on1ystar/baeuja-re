/* eslint-disable react/prop-types */

// Library import
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Stack Navigation
import { View, Text, TouchableOpacity } from 'react-native'; // React Native Component

// Screen import
import Login from '../../screens/login/Login';
import GetKpopLearningContents from '../learning/GetKpopLearningContents';
import LearningWord from '../../screens/learning/LearningWord';
import LearningUnits from '../../screens/learning/LearningUnits';
import LearningUnit from '../../screens/learning/LearningUnit';
import MoreInfo from '../../screens/learning/MoreInfo';
import Qna from '../../screens/my/Qna';
import sendQna from '../qna/sendQna';
import qnaInput from '../qna/qnaInput';
import Help from '../../screens/learning/Help';

const NativeStack = createNativeStackNavigator();

const Stack = () => (
  <NativeStack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
      headerTintColor: '#9388E8',
      backgroundColor: '#FFFFFF',
    }}
    sceneContainerStyle={{
      backgroundColor: '#FFFFFF',
    }}
  >
    <NativeStack.Screen name="Login" options={{ headerShown: false }} component={Login} />
    <NativeStack.Group screenOptions={{ presentation: 'modal' }}>
      <NativeStack.Screen name="MoreInfo" component={MoreInfo} />
      <NativeStack.Screen name="Help" component={Help} />
    </NativeStack.Group>
    <NativeStack.Screen name="GetKpopLearningContents" component={GetKpopLearningContents} />
    <NativeStack.Screen name="LearningWord" component={LearningWord} />
    <NativeStack.Screen options={{ flex: 1 }} name="LearningUnits" component={LearningUnits} />
    <NativeStack.Screen name="LearningUnit" component={LearningUnit} />
    <NativeStack.Screen name="Qna" component={Qna} />
    <NativeStack.Screen name="sendQna" component={sendQna} />
    <NativeStack.Screen name="qnaInput" component={qnaInput} />
  </NativeStack.Navigator>
);

export default Stack;

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
    <NativeStack.Screen options={{ presentation: 'modal' }} name="MoreInfo" component={MoreInfo} />
    <NativeStack.Screen name="GetKpopLearningContents" component={GetKpopLearningContents} />
    <NativeStack.Screen name="LearningWord" component={LearningWord} />
    <NativeStack.Screen options={{ flex: 1 }} name="LearningUnits" component={LearningUnits} />
    <NativeStack.Screen name="LearningUnit" component={LearningUnit} />
  </NativeStack.Navigator>
);

export default Stack;

/* eslint-disable react/prop-types */

// Library import
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Stack Navigation
import { View, Text, TouchableOpacity } from 'react-native'; // React Native Component

// Screnn import
import LearningUnits from '../../screens/learning/LearningUnits';
import Login from '../../screens/login/Login';
import LearningUnit from '../../screens/learning/LearningUnit';

const NativeStack = createNativeStackNavigator();

const Stack = () => (
  <NativeStack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
      headerTintColor: '#9388E8',
    }}
  >
    <NativeStack.Screen name="Login" component={Login} />
    <NativeStack.Screen name="LearningUnits" component={LearningUnits} />
    <NativeStack.Screen name="LearningUnit" component={LearningUnit} />
  </NativeStack.Navigator>
);

export default Stack;

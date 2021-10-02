/* eslint-disable react/prop-types */

// Library import
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Stack Navigation
import { View, Text, TouchableOpacity } from 'react-native'; // React Native Component

// Screnn import
import Units from '../../screens/learning/Units';
import Login from '../../screens/login/Login';
import Learning from '../../screens/learning/Learning';

const NativeStack = createNativeStackNavigator();

const Stack = () => (
  <NativeStack.Navigator
    screenOptions={{
      headerBackTitleVisible: false,
      headerTintColor: '#9388E8',
    }}
  >
    <NativeStack.Screen name="Units" component={Units} />
    <NativeStack.Screen name="Learning" component={Learning} />
    <NativeStack.Screen name="Login" component={Login} />
  </NativeStack.Navigator>
);

export default Stack;

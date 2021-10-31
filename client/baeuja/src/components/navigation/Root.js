/* eslint-disable react/prop-types */

// Library import
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Stack Navigation
import { StyleSheet, View, Text, TouchableOpacity, Image, BackHandler, Alert } from 'react-native'; // React Native Elements
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage

// Component import
import Tabs from './Tabs';
import Stack from './Stack';
import Login from '../../screens/login/Login';

const Nav = createNativeStackNavigator();

const RootNavigation = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to close the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
        },
        { text: 'Confirm', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <Nav.Navigator
      initialRouteName="Login"
      sceneContainerStyle={{
        backgroundColor: '#FFFFFF',
      }}
    >
      <Nav.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={Login}
      ></Nav.Screen>
      <Nav.Screen
        options={{
          headerShown: false,
        }}
        name="Tabs"
        component={Tabs}
      ></Nav.Screen>
      <Nav.Screen
        options={{
          headerShown: false,
        }}
        name="Stack"
        component={Stack}
      ></Nav.Screen>
    </Nav.Navigator>
  );
};

export default RootNavigation;

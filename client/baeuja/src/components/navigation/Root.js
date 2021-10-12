/* eslint-disable react/prop-types */

// Library import
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Stack Navigation
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'; // React Native Elements
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks

// Component import
import Tabs from './Tabs';
import Stack from './Stack';
import Login from '../../screens/login/Login';

const Nav = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <Nav.Navigator initialRouteName="Login">
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

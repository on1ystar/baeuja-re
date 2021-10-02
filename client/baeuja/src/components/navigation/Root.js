/* eslint-disable react/prop-types */

// Library import
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Stack Navigation
import Tabs from './Tabs';
import Stack from './Stack';

const Nav = createNativeStackNavigator();

const RootNavigation = () => (
  <Nav.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Nav.Screen name="Tabs" component={Tabs}></Nav.Screen>
    <Nav.Screen name="Stack" component={Stack}></Nav.Screen>
  </Nav.Navigator>
);

export default RootNavigation;

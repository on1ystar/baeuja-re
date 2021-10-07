/* eslint-disable react/prop-types */

// Library import
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Stack Navigation
import Tabs from './Tabs';
import Stack from './Stack';
import Login from '../../screens/login/Login';

const Nav = createNativeStackNavigator();

const RootNavigation = () => (
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

export default RootNavigation;

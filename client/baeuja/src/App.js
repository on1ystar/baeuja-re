/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

// Library import
import React, { Component, useEffect } from 'react';
import { StyleSheet, View, Text, Button, BackHandler } from 'react-native'; // React Native Component
import { NavigationContainer } from '@react-navigation/native'; // Navigation
import SplashScreen from 'react-native-splash-screen';

//Screen import
import RootNavigation from './components/navigation/Root';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
};

export default App;

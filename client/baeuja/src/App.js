/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

// Library import
import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native'; // React Native Component
import { NavigationContainer } from '@react-navigation/native'; // Navigation

//Screen import
import RootNavigation from './components/navigation/Root';

function App() {
  return (
    <NavigationContainer>
      <RootNavigation />
    </NavigationContainer>
  );
}

export default App;

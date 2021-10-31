import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
  useResponsiveHeight,
  useResponsiveWidth,
  useResponsiveScreenHeight,
} from 'react-native-responsive-dimensions'; // Responsive layout
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import { Card } from 'react-native-elements'; // React Native Elements

const Words = ({ currentSentence }) => {
  let koreanWords = currentSentence.words;
  let words = [];
  koreanWords.map((word) => {
    words.push(
      <Text key={word.wordId} style={{ color: '#797979' }}>
        {word.korean} : {word.translation}
      </Text>,
      ' '
    );
  });
  return <Text>{words}</Text>;
};

export default Words;

const styles = StyleSheet.create({
  wordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: responsiveScreenWidth(50),
    minWidth: responsiveScreenWidth(25),
    height: responsiveScreenHeight(2.5),
    marginRight: responsiveScreenWidth(2),
    borderRadius: 10,
    borderStyle: 'solid',
    borderColor: '#CCCCCC',
    borderWidth: 1,
  },
});

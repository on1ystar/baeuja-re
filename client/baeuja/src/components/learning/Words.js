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
import { Card } from 'react-native-elements'; // React Native Elements

const Words = ({ currentSentence }) => {
  let koreanWords = currentSentence.words;
  let words = [];
  koreanWords.map((word) => {
    words.push(
      <View key={word.wordId} style={styles.wordContainer}>
        <Text style={{ color: '#797979' }}>
          {word.originalKoreanText} : {word.originalTranslatedText}
        </Text>
      </View>,
      '  '
    );
  });
  return (
    <View>
      <Text>{words}</Text>
    </View>
  );
};

export default Words;

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
  },
  container: { marginRight: 10 },
  wordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'black',
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

import { element } from 'prop-types';
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

// Component import
import Words from './Words';

const Script = ({ currentSentence }) => {
  // 한국어 문장 만들기
  let koreanResult = [];
  let englishResult = [];

  console.log('Current Sentence is :', currentSentence);

  const drawKoreanSentence = () => {
    koreanResult = [currentSentence.koreanText.toLowerCase()];

    const resultKoreanhWords = currentSentence.words;

    resultKoreanhWords.forEach((word) => {
      let idx;
      let temp = [];
      let findFlag = false;
      koreanResult.forEach((element) => {
        if (typeof element === 'string') {
          idx = element.indexOf(word.prevKoreanText);
          if (idx === -1 || findFlag === true) idx = undefined;
          else findFlag = true;
        }
        if (idx !== undefined) {
          temp.push(element.slice(0, idx));
          temp.push(
            <Text key={word.wordId} style={{ color: '#3eb2ff', textDecorationLine: 'underline' }}>
              {word.prevKoreanText}
            </Text>
          );
          temp.push(element.slice(idx + word.prevKoreanText.length));
        } else {
          temp.push(element);
        }
        idx = undefined;
      });
      koreanResult = temp;
    });
    return koreanResult;
  };

  // 영어 문장 만들기
  const drawEnglishSentence = () => {
    englishResult = [currentSentence.translatedText.toLowerCase()];

    const resultEnglishWords = currentSentence.words;

    resultEnglishWords.forEach((word) => {
      let idx;
      let temp = [];
      englishResult.forEach((element) => {
        if (typeof element === 'string') {
          idx =
            element.indexOf(word.prevTranslatedText) === -1
              ? undefined
              : element.indexOf(word.prevTranslatedText);
        }
        if (idx !== undefined) {
          temp.push(element.slice(0, idx));
          temp.push(
            <Text key={word.wordId} style={{ color: '#3eb2ff', textDecorationLine: 'underline' }}>
              {word.prevTranslatedText}
            </Text>
          );
          temp.push(element.slice(idx + word.prevTranslatedText.length));
        } else {
          temp.push(element);
        }
        idx = undefined;
      });
      englishResult = temp;
    });
    return englishResult;
  };

  return (
    <View>
      <Card containerStyle={{ borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <View>
          <Text style={styles.koreanScript}>
            🇰🇷 : <Text>{drawKoreanSentence()}</Text>
          </Text>
        </View>
        <View>
          <Text style={styles.englishScript}>
            🇺🇸 : <Text> {drawEnglishSentence()}</Text>
          </Text>
        </View>
        <View>
          <Words currentSentence={currentSentence} />
        </View>
      </Card>
    </View>
  );
};

export default Script;

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
  },
  koreanScript: {
    fontSize: responsiveFontSize(2.4),
    color: '#555555',
    marginBottom: 5,
  },
  englishScript: {
    fontSize: responsiveFontSize(2.4),
    color: '#555555',
    marginBottom: 15,
  },
});

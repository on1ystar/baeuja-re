import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component

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
      koreanResult.forEach((element) => {
        if (typeof element === 'string') {
          idx =
            element.indexOf(word.prevKoreanText) === -1
              ? undefined
              : element.indexOf(word.prevKoreanText);
        }
        if (idx !== undefined) {
          temp.push(element.slice(0, idx));
          temp.push(
            <Text key={word.wordId} style={{ color: 'red' }}>
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
            <Text key={word.wordId} style={{ color: 'red' }}>
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
      <View>
        <Text>Korean : {drawKoreanSentence()}</Text>
      </View>
      <View>
        <Text>English : {drawEnglishSentence()}</Text>
      </View>
    </View>
  );
};

export default Script;

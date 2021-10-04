import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component

const Script = ({ currentSentence }) => {
  let result = [];
  const draw = () => {
    let resultWords = [];
    let sentence;
    console.log('Current Sentence is :', currentSentence);
    if (Object.keys(currentSentence).length !== 0) {
      sentence = currentSentence.koreanText;
      for (let i = 0; i < currentSentence.words.length; i++) {
        resultWords.push(currentSentence.words[i]);
      }
      resultWords.forEach((word) => {
        result.push(sentence.split(word.prevKoreanText)[0]);
        result.push(
          <Text
            style={{
              color: 'blue',
              fontSize: 20,
              textDecorationLine: 'underline',
            }}
            key={word.wordId}
          >
            {word.prevKoreanText}
          </Text>
        );
        sentence = sentence.split(word.prevKoreanText)[1];
      });

      result.push(sentence);
      console.log(`result : ${result}`);
      return result;
    }
  };

  return (
    <View>
      <Text>{draw()}</Text>
    </View>
  );
};

export default Script;

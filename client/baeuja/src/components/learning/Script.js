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
import { useNavigation } from '@react-navigation/native'; // Navigation
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons

// Component import
import Words from './Words';

const Script = ({ currentSentence }) => {
  const navigation = useNavigation();
  const [isBookmarked, setIsBookmarked] = useState(currentSentence.isBookmark);
  let koreanResult = [];
  let englishResult = [];

  console.log('Current Sentence is :', currentSentence);

  // 한국어 문장 만들기
  const drawKoreanSentence = () => {
    koreanResult = [currentSentence.koreanText];

    const resultKoreanhWords = currentSentence.words;

    resultKoreanhWords.forEach((word) => {
      let idx;
      let temp = [];
      let findFlag = false;
      koreanResult.forEach((element) => {
        if (typeof element === 'string') {
          idx = element.indexOf(word.koreanInText);
          if (idx === -1 || findFlag === true) idx = undefined;
          else findFlag = true;
        }
        if (idx !== undefined) {
          temp.push(element.slice(0, idx));
          temp.push(
            <Text
              onPress={() =>
                navigation.navigate('Stack', {
                  screen: 'LearningWord',
                  params: {
                    word,
                  },
                })
              }
              key={word.wordId}
              style={{
                fontSize: responsiveFontSize(2.1),
                color: '#4278A4',
                textDecorationLine: 'underline',
              }}
            >
              {word.koreanInText}
            </Text>
          );
          temp.push(element.slice(idx + word.koreanInText.length));
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
            element.indexOf(word.translationInText) === -1
              ? undefined
              : element.indexOf(word.translationInText);
        }
        if (idx !== undefined) {
          temp.push(element.slice(0, idx));
          temp.push(
            <Text
              onPress={() =>
                navigation.navigate('Stack', {
                  screen: 'LearningWord',
                  params: {
                    word,
                  },
                })
              }
              key={word.wordId}
              style={{
                fontSize: responsiveFontSize(2.1),
                color: '#4278A4',
                textDecorationLine: 'underline',
              }}
            >
              {word.translationInText}
            </Text>
          );
          temp.push(element.slice(idx + word.translationInText.length));
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
    <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
      <TouchableOpacity
        style={styles.bookmarkContainer}
        onPress={() => {
          setIsBookmarked(!isBookmarked);
          console.log(isBookmarked);
        }}
      >
        <Ionicons
          size={25}
          color={isBookmarked ? '#FFAD41' : '#AAAAAA'}
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
        ></Ionicons>
      </TouchableOpacity>
      <Text style={styles.koreanScript}>{drawKoreanSentence()}</Text>
      <Text style={styles.englishScript}>{drawEnglishSentence()}</Text>
      <Words currentSentence={currentSentence} />
    </Card>
  );
};

export default Script;

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
  },
  container: {
    marginRight: responsiveScreenWidth(3),
  },
  bookmarkContainer: {
    zIndex: 1,
    position: 'absolute',
    right: responsiveScreenWidth(-3),
    top: responsiveScreenHeight(-1),
  },
  koreanScript: {
    fontSize: responsiveFontSize(2.1),
    color: '#555555',
    marginBottom: responsiveScreenHeight(1),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlignVertical: 'bottom',
    width: responsiveScreenWidth(80),
  },
  englishScript: {
    fontSize: responsiveFontSize(2.1),
    color: '#555555',
    marginBottom: responsiveScreenHeight(1),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlignVertical: 'bottom',
    width: responsiveScreenWidth(80),
  },
});

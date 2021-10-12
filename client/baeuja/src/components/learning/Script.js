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
            <TouchableOpacity
              key={word.wordId}
              onPress={() =>
                navigation.navigate('Stack', {
                  screen: 'LearningWord',
                  params: {
                    word,
                  },
                })
              }
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(2.4),
                  color: '#3EB2FF',
                  textDecorationLine: 'underline',
                }}
              >
                {word.prevKoreanText}
              </Text>
            </TouchableOpacity>
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
            <TouchableOpacity
              key={word.wordId}
              onPress={() =>
                navigation.navigate('Stack', {
                  screen: 'LearningWord',
                  params: {
                    word,
                  },
                })
              }
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(2.4),
                  color: '#3eb2ff',
                  textDecorationLine: 'underline',
                }}
              >
                {word.prevTranslatedText}
              </Text>
            </TouchableOpacity>
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
  container: {
    marginRight: 10,
  },
  bookmarkContainer: {
    zIndex: 1,
    position: 'absolute',
    right: responsiveScreenWidth(-3),
    top: responsiveScreenHeight(-1),
  },
  koreanScript: {
    fontSize: responsiveFontSize(2.3),
    color: '#555555',
    marginBottom: 5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlignVertical: 'bottom',
    width: responsiveScreenWidth(80),
  },
  englishScript: {
    fontSize: responsiveFontSize(2.3),
    color: '#555555',
    marginBottom: 15,
  },
});

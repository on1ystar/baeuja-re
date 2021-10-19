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
import Antdesign from 'react-native-vector-icons/AntDesign'; // AntDesign
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import axios from 'axios'; // axios

// Component import
import Words from './Words';

const Script = ({ currentSentence, updateIsBookmark }) => {
  const navigation = useNavigation();
  let koreanResult = [];
  let englishResult = [];
  // const [bookmarkValue, setBookmarkValue] = useState(isBookmarked);

  // 한국어 문장 만들기
  const drawKoreanSentence = () => {
    koreanResult = [currentSentence.koreanText];

    const resultKoreanhWords = currentSentence.words;

    resultKoreanhWords.forEach((word) => {
      let idx;
      let temp = [];
      let findFlag = false;
      let wordId = word.wordId;
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
                    wordId,
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
      let wordId = word.wordId;
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
                    wordId,
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

  // 즐겨찾기 추가 함수
  const addBookmark = () => {
    AsyncStorage.getItem('token', async (error, token) => {
      // setBookmarkValue(!bookmarkValue);
      try {
        if (token === null) {
          // login으로 redirect
        }
        // AsyncStorage error
        if (error) throw error;
        console.log(currentSentence.sentenceId);
        const {
          data: { success, isBookmark },
        } = await axios.post(
          `https://api.k-peach.io/bookmark/sentences/${currentSentence.sentenceId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //   if (tokenExpired) {
        //     // login으로 redirect
        //   }

        updateIsBookmark(currentSentence.sentenceId);

        console.log(`Bookmark Post Success is :${success}`);
        console.log(`After Post, isBookmark is :${isBookmark}`);

        if (!success) throw new Error(errorMessage);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // Script 렌더링 부분
  return (
    <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
      <TouchableOpacity
        style={styles.bookmarkContainer}
        onPress={() => {
          addBookmark();
        }}
      >
        <Antdesign
          size={25}
          color={currentSentence.isBookmark ? '#FFAD41' : '#AAAAAA'}
          name={currentSentence.isBookmark ? 'star' : 'staro'}
        ></Antdesign>
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

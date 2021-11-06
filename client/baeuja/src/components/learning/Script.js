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
    if (currentSentence.isConversation || currentSentence.isFamousLine) {
      koreanResult = [
        <Text
          key={currentSentence.sentenceId}
          style={{
            fontSize: responsiveFontSize(2.1),
            color: '#4278A4',
          }}
        >
          {currentSentence.koreanText}
        </Text>,
      ];
    } else {
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
                    screen: 'Learning Word',
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
    }
    return koreanResult;
  };

  // 영어 문장 만들기
  const drawEnglishSentence = () => {
    if (currentSentence.isConversation || currentSentence.isFamousLine) {
      englishResult = [
        <Text
          key={currentSentence.sentenceId + 1}
          style={{
            fontSize: responsiveFontSize(1.8),
            color: '#4278A4',
          }}
        >
          {currentSentence.translatedText}
        </Text>,
      ];
    } else {
      englishResult = [currentSentence.translatedText];

      const resultEnglishWords = currentSentence.words;

      resultEnglishWords.forEach((word) => {
        let idx;
        let temp = [];
        let findFlag = false;
        let wordId = word.wordId;
        englishResult.forEach((element) => {
          if (typeof element === 'string') {
            idx = element.indexOf(word.translationInText);
            if (word.translationInText === null) idx = undefined;
            else {
              if (idx === -1 || findFlag === true) idx = undefined;
              else {
                idx = element.toLowerCase().indexOf(word.translationInText.toLowerCase());
                findFlag = true;
              }
            }
          }
          if (idx !== undefined) {
            temp.push(element.slice(0, idx));
            temp.push(
              <Text
                onPress={() =>
                  navigation.navigate('Stack', {
                    screen: 'Learning Word',
                    params: {
                      wordId,
                    },
                  })
                }
                key={word.wordId}
                style={{
                  fontSize: responsiveFontSize(1.8),
                  color: '#4278A4',
                  textDecorationLine: 'underline',
                }}
              >
                {word.translationInText}
              </Text>
            );
            console.log(idx + word.translationInText.length);
            temp.push(element.slice(idx + word.translationInText.length));
          } else {
            temp.push(element);
          }
          idx = undefined;
        });
        englishResult = temp;
      });
    }
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
        if (isBookmark) {
          Alert.alert('Added', 'Added to Bookmark', [{ text: 'Confirm', onPress: () => null }]);
          // alert('Added to Bookmark');
        } else {
          Alert.alert('Deleted', 'Deleted from Bookmark', [
            { text: 'Confirm', onPress: () => null },
          ]);
        }

        if (!success) throw new Error(errorMessage);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // Script 렌더링 부분
  return (
    <Card containerStyle={{ borderWidth: 1, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
      <TouchableOpacity
        style={styles.bookmarkContainer}
        onPress={() => {
          addBookmark();
        }}
      >
        {currentSentence.perfectVoiceUri === 'NULL' ? (
          <></>
        ) : (
          <Antdesign
            size={25}
            color={currentSentence.isBookmark ? '#FFAD41' : '#AAAAAA'}
            name={currentSentence.isBookmark ? 'star' : 'staro'}
          ></Antdesign>
        )}
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
    right: responsiveScreenWidth(0),
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
    fontWeight: '700',
  },
  englishScript: {
    fontSize: responsiveFontSize(1.8),
    color: '#555555',
    opacity: 0.9,
    marginBottom: responsiveScreenHeight(1),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlignVertical: 'bottom',
    width: responsiveScreenWidth(80),
  },
});

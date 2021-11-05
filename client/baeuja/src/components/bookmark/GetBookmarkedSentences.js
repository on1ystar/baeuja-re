// Library import
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'; // React Native elements
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
import { useNavigation } from '@react-navigation/native'; // Navigation
import axios from 'axios'; // axios
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicon
import Antdesign from 'react-native-vector-icons/AntDesign'; // AntDesign
import { Card } from 'react-native-elements'; // React Native Elements
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage

// 북마크 문장 화면 전체 그리는 함수
const GetBookmarkedSentences = ({ sortBy, option }) => {
  const [bookmarkedSentences, setBookmarkedSentences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [randomNumber, setRandomNumber] = useState(Math.random());

  // 북마크 문장 불러오기
  const loadBookmarkedSentences = () => {
    // 즐겨찾기 문장 데이터 가져오기
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        // 쿼리 : sentences 뒤에 ?sortBy=latest_learning_at&option=ASC 붙이기 bookmark_at, DESC
        const sortByQeury = sortBy === '' ? 'sortBy=bookmark_at' : `sortBy=${sortBy}`;
        const optionQeury = option === '' ? 'option=DESC' : `option=${option}`;
        const {
          data: { success, sentences, tokenExpired, errorMessage },
        } = await axios.get(
          `https://dev.k-peach.io/bookmark/sentences?${sortByQeury}&${optionQeury}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\n sentences: ${sentences}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting Bookmarked Sentences');

        setBookmarkedSentences(sentences);
        setIsLoading(() => false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 북마크 상태 변경 함수
  const addBookmark = ({ bookmarkedSentence }) => {
    AsyncStorage.getItem('token', async (error, token) => {
      // setBookmarkValue(!bookmarkValue);
      try {
        if (token === null) {
          // login으로 redirect
        }
        // AsyncStorage error
        if (error) throw error;
        console.log(bookmarkedSentence.sentenceId);
        const {
          data: { success, isBookmark },
        } = await axios.post(
          `https://dev.k-peach.io/bookmark/sentences/${bookmarkedSentence.sentenceId}`,
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

        console.log(`Bookmark Post Success is :${success}`);
        console.log(`After Post, isBookmark is :${isBookmark}`);

        if (isBookmark) {
          Alert.alert('Deleted', 'Deleted from Bookmark', [
            { text: 'Confirm', onPress: () => null },
          ]);
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

  // useEffect
  useEffect(loadBookmarkedSentences, [randomNumber, sortBy, option]);

  // GetBookmarkedSentences Screen 전체 렌더링
  return (
    <View style={{ marginBottom: responsiveScreenHeight(10) }}>
      {isLoading ? (
        <Text></Text>
      ) : (
        bookmarkedSentences.map((bookmarkedSentence) => {
          const navigation = useNavigation();
          const contentId = bookmarkedSentence.contentId;
          const unitIndex = bookmarkedSentence.unitIndex;
          let latestLearningAt;
          let bookmarkedAt;

          if (bookmarkedSentence.latestLearningAt == null) {
            latestLearningAt = 'Not learned yet';
          } else {
            latestLearningAt = bookmarkedSentence.latestLearningAt.split('T');
            latestLearningAt = latestLearningAt[0];
          }
          if (bookmarkedSentence.bookmarkAt == null) {
            bookmarkedAt = 'Not bookmarked yet';
          } else {
            bookmarkedAt = bookmarkedSentence.bookmarkAt.split('T');
            bookmarkedAt = bookmarkedAt[0];
          }
          return (
            <ScrollView key={bookmarkedSentence.sentenceId}>
              <Card
                containerStyle={{
                  borderWidth: 0.5,
                  borderRadius: 10,
                  backgroundColor: '#FBFBFB',
                  marginBottom: responsiveScreenHeight(0.1),
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Stack', {
                      screen: 'Learning Unit',
                      params: {
                        contentId,
                        unitIndex,
                      },
                    })
                  }
                >
                  <View style={styles.bookmarkedSentencesContainer}>
                    <Text
                      style={styles.bookmarkedKoreanSentences}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {bookmarkedSentence.koreanText}
                    </Text>
                    <Text style={styles.bookmarkedSentences} numberOfLines={1} ellipsizeMode="tail">
                      {bookmarkedSentence.translatedText}
                    </Text>
                    <View
                      style={{
                        marginLeft: responsiveScreenWidth(5),
                        width: responsiveScreenWidth(75),
                        marginTop: responsiveScreenHeight(1),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: responsiveFontSize(1.5) }}>
                        <Ionicons name="pencil-outline" size={10} color={'#FFAD41'}></Ionicons>{' '}
                        <Text style={{ color: '#BBB2F9', fontFamily: 'NanumSquareOTFB' }}>
                          {latestLearningAt}
                        </Text>
                      </Text>
                      <Text
                        style={{ fontSize: responsiveFontSize(1.5), fontFamily: 'NanumSquareOTFB' }}
                      >
                        <View>
                          <Antdesign size={10} color={'#FFAD41'} name={'star'}></Antdesign>
                        </View>{' '}
                        <Text style={{ color: '#BBB2F9' }}>{bookmarkedAt}</Text>
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bookmarkedIconContainer}
                  onPress={() => {
                    addBookmark({ bookmarkedSentence });
                    setRandomNumber(Math.random());
                  }}
                >
                  <Antdesign color={'#FFAD41'} size={25} name={'star'}></Antdesign>
                </TouchableOpacity>
              </Card>
            </ScrollView>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
  },
  bookmarkedSentencesContainer: {
    justifyContent: 'space-around',
  },
  bookmarkedKoreanSentences: {
    color: '#444444',
    width: responsiveScreenWidth(70),
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '700',
    marginBottom: responsiveScreenHeight(1),
  },
  bookmarkedSentences: {
    width: responsiveScreenWidth(80),
    color: '#444444',
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '700',
  },
  bookmarkedIconContainer: {
    position: 'absolute',
    right: responsiveScreenWidth(0),
    top: responsiveScreenHeight(-0.5),
    justifyContent: 'flex-end',
  },
});

export default GetBookmarkedSentences;

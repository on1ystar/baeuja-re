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

const GetBookmarkedWords = ({ sortBy, option, reload, startIndex }) => {
  const navigation = useNavigation();
  const [bookmarkedWords, setBookmarkedWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [randomNumber, setRandomNumber] = useState(Math.random());

  // 북마크 단어 불러오기
  const loadBookmarkedWords = () => {
    // 즐겨찾기 단어 데이터 가져오기
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const sortByQeury = `sortBy=${sortBy}`;
        const optionQeury = `option=${option}`;
        const {
          data: { success, words, tokenExpired, errorMessage },
        } = await axios.get(`https://api.k-peach.io/bookmark/words?${sortByQeury}&${optionQeury}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\n`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting Bookmarked Words');

        setBookmarkedWords(words);
        setIsLoading(() => false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // Bookmark 상태 변경 함수
  const addBookmark = ({ bookmarkedWord }) => {
    AsyncStorage.getItem('token', async (error, token) => {
      // setBookmarkValue(!bookmarkValue);
      try {
        if (token === null) {
          // login으로 redirect
        }
        // AsyncStorage error
        if (error) throw error;
        const {
          data: { success, isBookmark },
        } = await axios.post(
          `https://api.k-peach.io/bookmark/words/${bookmarkedWord.wordId}`,
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
  useEffect(loadBookmarkedWords, [reload, randomNumber, sortBy, option]);

  return (
    <View style={{ marginBottom: responsiveScreenHeight(10) }}>
      {isLoading ? (
        <Text></Text>
      ) : (
        bookmarkedWords.slice(0, startIndex + 10).map((bookmarkedWord) => {
          const wordId = bookmarkedWord.wordId;
          let latestLearningAt;
          let bookmarkedAt;
          if (bookmarkedWord.latestLearningAt == null) {
            latestLearningAt = 'Not learned yet';
          } else {
            latestLearningAt = bookmarkedWord.latestLearningAt.split('T');
            latestLearningAt = latestLearningAt[0];
          }
          if (bookmarkedWord.bookmarkAt == null) {
            bookmarkedAt = 'Not bookmarked yet';
          } else {
            bookmarkedAt = bookmarkedWord.bookmarkAt.split('T');
            bookmarkedAt = bookmarkedAt[0];
          }
          return (
            <View style={styles.allContainer} key={bookmarkedWord.wordId}>
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
                      screen: 'Learning Word',
                      params: {
                        wordId,
                      },
                    })
                  }
                >
                  <View style={styles.bookmarkedWordsContainer}>
                    <Text
                      style={styles.bookmarkedKoreanWords}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {bookmarkedWord.korean}
                    </Text>
                    <Text style={styles.bookmarkedWords} numberOfLines={1} ellipsizeMode="tail">
                      {bookmarkedWord.translation}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginLeft: responsiveScreenWidth(5),
                      width: responsiveScreenWidth(68),
                      marginTop: responsiveScreenHeight(1),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.5),
                      }}
                    >
                      <Ionicons name="pencil-outline" size={10} color={'#FFAD41'}></Ionicons>{' '}
                      <Text style={{ color: '#AAAAAA', fontFamily: 'NanumSquareOTFB' }}>
                        {latestLearningAt}
                      </Text>
                    </Text>
                    <Text style={{ fontSize: responsiveFontSize(1.5) }}>
                      <View>
                        <Antdesign size={10} color={'#FFAD41'} name={'star'}></Antdesign>
                      </View>{' '}
                      <Text style={{ color: '#AAAAAA', fontFamily: 'NanumSquareOTFB' }}>
                        {bookmarkedAt}
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bookmarkedIconContainer}
                  onPress={() => {
                    addBookmark({ bookmarkedWord });
                    setRandomNumber(Math.random());
                  }}
                >
                  <Antdesign color={'#FFAD41'} size={25} name={'star'}></Antdesign>
                </TouchableOpacity>
              </Card>
            </View>
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
  bookmarkedWordsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkedKoreanWords: {
    marginLeft: responsiveScreenWidth(5),
    marginRight: responsiveScreenWidth(5),
    color: '#444444',
    width: responsiveScreenWidth(40),
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '700',
  },
  bookmarkedWords: {
    color: '#444444',
    width: responsiveScreenWidth(25),
    fontSize: responsiveScreenFontSize(1.6),
    fontFamily: 'NanumSquareOTFB',
    opacity: 0.9,
  },
  bookmarkedIconContainer: {
    position: 'absolute',
    right: responsiveScreenWidth(-2),
    top: responsiveScreenHeight(-0.5),
    justifyContent: 'flex-end',
  },
});

export default GetBookmarkedWords;

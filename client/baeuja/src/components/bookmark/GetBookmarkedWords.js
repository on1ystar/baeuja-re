// Library import
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'; // React Native elements
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

const GetBookmarkedWords = () => {
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
        const {
          data: { success, words, tokenExpired, errorMessage },
        } = await axios.get(`https://api.k-peach.io/bookmark/words`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\n words: ${words}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting Bookmarked Words');

        setBookmarkedWords(words);
        setIsLoading(() => false);

        if (isBookmark) {
          alert('Added to Bookmark');
        } else {
          alert('Deleted from Bookmark');
        }
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
        console.log(bookmarkedWord.wordId);
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
          alert('Deleted from Bookmark');
        } else {
          alert('Deleted from Bookmark');
        }

        if (!success) throw new Error(errorMessage);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // useEffect
  useEffect(loadBookmarkedWords, [randomNumber]);

  return (
    <View>
      {isLoading ? (
        <Text></Text>
      ) : (
        bookmarkedWords.map((bookmarkedWord) => {
          const wordId = bookmarkedWord.wordId;
          return (
            <ScrollView style={styles.allContainer} key={bookmarkedWord.wordId}>
              <Card
                containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}
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
                    <Text style={styles.bookmarkedWords}>{bookmarkedWord.korean}</Text>
                    <Text style={styles.bookmarkedWords}>{bookmarkedWord.translation}</Text>
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
  bookmarkedWordsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bookmarkedWords: {
    color: '#000000',
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  bookmarkedIconContainer: {
    position: 'absolute',
    right: responsiveScreenWidth(-2),
    top: responsiveScreenHeight(-0.5),
    justifyContent: 'flex-end',
  },
});

export default GetBookmarkedWords;

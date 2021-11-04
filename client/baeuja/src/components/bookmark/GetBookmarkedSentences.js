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

// 북마크 문장 화면 전체 그리는 함수
const GetBookmarkedSentences = () => {
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
        const {
          data: { success, sentences, tokenExpired, errorMessage },
        } = await axios.get(`https://api.k-peach.io/bookmark/sentences`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
          `https://api.k-peach.io/bookmark/sentences/${bookmarkedSentence.sentenceId}`,
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
  useEffect(loadBookmarkedSentences, [randomNumber]);

  // GetBookmarkedSentences Screen 전체 렌더링
  return (
    <View>
      {isLoading ? (
        <Text></Text>
      ) : (
        bookmarkedSentences.map((bookmarkedSentence) => {
          const navigation = useNavigation();
          const contentId = bookmarkedSentence.contentId;
          const unitIndex = bookmarkedSentence.unitIndex;
          return (
            <ScrollView key={bookmarkedSentence.sentenceId}>
              <Card
                containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}
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
                    <Text style={styles.bookmarkedKoreanSentences}>
                      {bookmarkedSentence.koreanText}
                    </Text>
                    <Text style={styles.bookmarkedSentences}>
                      {bookmarkedSentence.translatedText}
                    </Text>
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
    color: '#000000',
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    marginBottom: responsiveScreenHeight(1),
  },
  bookmarkedSentences: {
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

export default GetBookmarkedSentences;

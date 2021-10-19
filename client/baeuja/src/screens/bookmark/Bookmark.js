// Library import
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'; // React Native elements
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
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

// Component import
import GetBookmarkedWords from '../../components/bookmark/GetBookmarkedWords';
import GetBookmarkedSentences from '../../components/bookmark/GetBookmarkedSentences';

const Bookmark = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState(false);
  const [bookmarkedSentences, setBookmarkedSentences] = useState([]);
  const [bookmarkedWords, setBookmarkedWords] = useState([]);

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

  const loadBookmarkedWords = () => {
    // 즐겨찾기 문장 데이터 가져오기
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
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(loadBookmarkedSentences, []);
  useEffect(loadBookmarkedWords, []);

  return (
    <View style={styles.allContainer}>
      <View style={styles.bookmarkTitleContainer}>
        <Text style={styles.bookmarkTitle}>Bookmark</Text>
      </View>
      <View style={styles.selectButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            setWords(true);
          }}
        >
          <View style={words ? styles.wordsButtonSelected : styles.wordsButtonNotSelected}>
            <Text style={words ? styles.wordsTextSelected : styles.wordsTextNotSelected}>
              Words
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setWords(false);
          }}
        >
          <View style={words ? styles.sentencesButtonNotSelected : styles.sentencesButtonSelected}>
            <Text style={words ? styles.sentencesTextNotSelected : styles.sentencesTextSelected}>
              Sentences
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#EFEFEF',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            width: responsiveScreenWidth(10),
            height: responsiveScreenWidth(10),
          }}
        >
          <TouchableOpacity>
            <Ionicons color={'#000000'} size={30} name="options"></Ionicons>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.timeContainer}>
        <Ionicons color={'#000000'} size={25} name="time-outline"></Ionicons>
        <Text style={styles.timeText}>2021. 10.</Text>
      </View>
      <ScrollView>
        {words ? (
          <ScrollView>
            <GetBookmarkedWords bookmarkedWords={bookmarkedWords} />
          </ScrollView>
        ) : (
          <ScrollView>
            <GetBookmarkedSentences bookmarkedSentences={bookmarkedSentences} />
          </ScrollView>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
  },
  bookmarkTitleContainer: {
    marginTop: responsiveScreenHeight(7),
    marginLeft: responsiveScreenWidth(5),
  },
  bookmarkTitle: {
    fontSize: responsiveScreenFontSize(3),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#9388E8',
  },
  selectButtonContainer: {
    flexDirection: 'row',
    marginTop: responsiveScreenHeight(3),
    width: responsiveScreenWidth(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordsButtonSelected: {
    backgroundColor: '#9388E8',
    width: responsiveScreenWidth(30),
    height: responsiveScreenHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginRight: responsiveScreenWidth(5),
    marginLeft: responsiveScreenWidth(2),
  },
  wordsButtonNotSelected: {
    backgroundColor: '#EDEDED',
    width: responsiveScreenWidth(30),
    height: responsiveScreenHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginRight: responsiveScreenWidth(5),
    marginLeft: responsiveScreenWidth(2),
  },
  wordsTextSelected: {
    fontSize: responsiveScreenFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wordsTextNotSelected: {
    fontSize: responsiveScreenFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#AAAAAA',
  },
  sentencesTextSelected: {
    fontSize: responsiveScreenFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sentencesTextNotSelected: {
    fontSize: responsiveScreenFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#AAAAAA',
  },
  sentencesButtonSelected: {
    backgroundColor: '#9388E8',
    width: responsiveScreenWidth(30),
    height: responsiveScreenHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginRight: responsiveScreenWidth(5),
    marginLeft: responsiveScreenWidth(2),
  },
  sentencesButtonNotSelected: {
    backgroundColor: '#EDEDED',
    width: responsiveScreenWidth(30),
    height: responsiveScreenHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginRight: responsiveScreenWidth(5),
    marginLeft: responsiveScreenWidth(2),
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveScreenHeight(5),
    marginLeft: responsiveScreenWidth(5),
  },
  timeText: {
    color: '#000000',
    marginLeft: responsiveScreenWidth(2),
    fontSize: responsiveFontSize(2.2),
  },
});

export default Bookmark;

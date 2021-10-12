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
import { Card } from 'react-native-elements'; // React Native Elements
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage

// Component import
import GetBookmarkedWords from '../../components/bookmark/GetBookmarkedWords';
import GetBookmarkedSentences from '../../components/bookmark/GetBookmarkedSentences';

const Bookmark = () => {
  const [words, setWords] = useState(true);
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
            <Ionicons size={30} name="options"></Ionicons>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.timeContainer}>
        <Ionicons size={25} name="time-outline"></Ionicons>
        <Text style={styles.timeText}>2021. 10.</Text>
      </View>
      <View>
        {words ? (
          <View>
            <GetBookmarkedWords />
          </View>
        ) : (
          <View>
            <GetBookmarkedSentences />
          </View>
        )}
      </View>
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
    marginLeft: responsiveScreenWidth(2),
    fontSize: responsiveFontSize(2.2),
  },
});

export default Bookmark;

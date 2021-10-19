// Library import
import React from 'react'; // React
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

const GetBookmarkedWords = ({ bookmarkedWords }) => {
  return (
    <View>
      {bookmarkedWords.map((bookmarkWord) => {
        <DrawBookmarkedWords key={bookmarkWord.wordId} bookmarkWord={bookmarkWord} />;
      })}
    </View>
  );
};

const DrawBookmarkedWords = ({ bookmarkWord }) => {
  return (
    <ScrollView>
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedWordsContainer}>
            <Text style={styles.bookmarkedWords}>{bookmarkWord.korean}</Text>
            <Text style={styles.bookmarkedWords}>{bookmarkWord.translation}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Antdesign color={'#FFAD41'} size={25} name={'star'}></Antdesign>
        </TouchableOpacity>
      </Card>
    </ScrollView>
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

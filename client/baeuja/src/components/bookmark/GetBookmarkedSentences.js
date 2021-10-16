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
import { Card } from 'react-native-elements'; // React Native Elements
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage

const GetBookmarkedSentences = () => {
  return (
    <View>
      <DrawBookmarkedWords />
    </View>
  );
};

const DrawBookmarkedWords = () => {
  return (
    <ScrollView>
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedSentencesContainer}>
            <Text style={styles.bookmarkedKoreanSentences}>첫 눈에 널 알아보게 됐어</Text>
            <Text style={styles.bookmarkedSentences}>I recognized you at first sight</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedSentencesContainer}>
            <Text style={styles.bookmarkedKoreanSentences}>아들아, 너는 계획이 다 있구나</Text>
            <Text style={styles.bookmarkedSentences}>Son, you have a plan</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedSentencesContainer}>
            <Text style={styles.bookmarkedKoreanSentences}>너 뭔데 자꾸 생각나</Text>
            <Text style={styles.bookmarkedSentences}>I keep thinking of you</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedSentencesContainer}>
            <Text style={styles.bookmarkedKoreanSentences}>아들아, 너는 계획이 다 있구나</Text>
            <Text style={styles.bookmarkedSentences}>Son, you have a plan</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedSentencesContainer}>
            <Text style={styles.bookmarkedKoreanSentences}>아들아, 너는 계획이 다 있구나</Text>
            <Text style={styles.bookmarkedSentences}>Son, you have a plan</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedSentencesContainer}>
            <Text style={styles.bookmarkedKoreanSentences}>아들아, 너는 계획이 다 있구나</Text>
            <Text style={styles.bookmarkedSentences}>Son, you have a plan</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
    </ScrollView>
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

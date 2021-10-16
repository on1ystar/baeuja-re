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

const GetBookmarkedWords = () => {
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
          <View style={styles.bookmarkedWordsContainer}>
            <Text style={styles.bookmarkedWords}>첫 눈</Text>
            <Text style={styles.bookmarkedWords}>First sight</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedWordsContainer}>
            <Text style={styles.bookmarkedWords}>생각</Text>
            <Text style={styles.bookmarkedWords}>Thinking</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedWordsContainer}>
            <Text style={styles.bookmarkedWords}>허리</Text>
            <Text style={styles.bookmarkedWords}>Waist</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedWordsContainer}>
            <Text style={styles.bookmarkedWords}>생각</Text>
            <Text style={styles.bookmarkedWords}>Thinking</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedWordsContainer}>
            <Text style={styles.bookmarkedWords}>생각</Text>
            <Text style={styles.bookmarkedWords}>Thinking</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedWordsContainer}>
            <Text style={styles.bookmarkedWords}>생각</Text>
            <Text style={styles.bookmarkedWords}>Thinking</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedWordsContainer}>
            <Text style={styles.bookmarkedWords}>생각</Text>
            <Text style={styles.bookmarkedWords}>Thinking</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedWordsContainer}>
            <Text style={styles.bookmarkedWords}>생각</Text>
            <Text style={styles.bookmarkedWords}>Thinking</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkedIconContainer}>
          <Ionicons color={'#FFAD41'} size={25} name={'bookmark'}></Ionicons>
        </TouchableOpacity>
      </Card>
      {/*단어 카드 구분 */}
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <TouchableOpacity>
          <View style={styles.bookmarkedWordsContainer}>
            <Text style={styles.bookmarkedWords}>생각</Text>
            <Text style={styles.bookmarkedWords}>Thinking</Text>
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

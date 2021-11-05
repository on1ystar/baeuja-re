// Library import
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import {
  StyleSheet,
  Button,
  View,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'; // React Native Component
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe'; // Youtube Player
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
import axios from 'axios'; // axios
import Sound from 'react-native-sound'; // React Native Sound (성우 음성 재생)
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player'; // React Native Audio Recorder Player (사용자 음성 녹음 및 재생)
import DocumentPicker from 'react-native-document-picker'; // Document Picker (파일 업로드)
import Antdesign from 'react-native-vector-icons/AntDesign'; // AntDesign
import Icon2 from 'react-native-vector-icons/Feather'; // Feather
import Icon3 from 'react-native-vector-icons/MaterialIcons'; // MaterialIcons
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import RNFS from 'react-native-fs';
import { useFocusEffect, useIsFocused } from '@react-navigation/native'; // Navigation
import { Card, Divider } from 'react-native-elements'; // React Native Elements
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons
import { useNavigation } from '@react-navigation/native'; // Navigation

const Review = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [reviewRecords, setReviewRecords] = useState({});
  const [randomNumber, setRandomNumber] = useState(0);

  // 리뷰 기록 데이터 불러오기
  const loadReviewRecords = () => {
    // 즐겨찾기 단어 데이터 가져오기
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: { success, learningHistory, tokenExpired, errorMessage },
        } = await axios.get(`https://dev.k-peach.io/review`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\nLearning History: ${learningHistory}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting Learning History');
        console.log(`${learningHistory.avarageScoreOfWords}`);

        setReviewRecords(learningHistory);
        setRandomNumber(Math.random());
        setIsLoading(() => false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // useEffect
  useEffect(loadReviewRecords, []);

  let countsOfWords;
  let averageScoreOfWords;
  let countsOfSentences;
  let averageScoreOfSentences;

  if (reviewRecords.countsOfWords == null) {
    countsOfWords = 0;
  } else {
    countsOfWords = reviewRecords.countsOfWords;
  }

  if (reviewRecords.averageScoreOfWords == null) {
    averageScoreOfWords = 0;
  } else {
    averageScoreOfWords = reviewRecords.averageScoreOfWords;
  }

  if (reviewRecords.countsOfSentences == null) {
    countsOfSentences = 0;
  } else {
    countsOfSentences = reviewRecords.countsOfSentences;
  }

  if (reviewRecords.averageScoreOfSentences == null) {
    averageScoreOfSentences = 0;
  } else {
    averageScoreOfSentences = reviewRecords.averageScoreOfSentences;
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <></>
      ) : (
        <View style={styles.container}>
          <Text style={styles.mainText}>Review</Text>
          <Divider
            style={{ width: '100%', marginTop: responsiveScreenHeight(1) }}
            color="#EEEEEE"
            insetType="middle"
            width={1}
            orientation="horizontal"
          />
          {/* <Image
            transitionDuration={1000}
            source={require('../../assets/img/review.png')}
            style={styles.thumbnailImage}
          /> */}
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
              marginTop: responsiveScreenHeight(3),
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image transitionDuration={1000} source={require('../../assets/icons/word.png')} />
              <Text
                style={{
                  width: responsiveScreenWidth(65),
                  color: '#111111',
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(2.5),
                  marginLeft: responsiveScreenWidth(4),
                  fontFamily: 'NanumSquareOTFB',
                }}
              >
                Words
              </Text>
              <TouchableOpacity
                style={styles.goToLearnArrow}
                onPress={() => {
                  navigation.navigate('Stack', {
                    screen: 'Words Review',
                  });
                }}
              >
                <Ionicons size={30} color={'#444444'} name="chevron-forward-outline"></Ionicons>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: responsiveScreenWidth(1) }}>
              <Text
                style={{
                  color: '#111111',
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(1.6),
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'NanumSquareOTFB',
                }}
              >
                You have learned a total of{' '}
                <Text
                  style={{
                    color: '#F9AD3B',
                    fontWeight: 'bold',
                    fontSize: responsiveFontSize(1.6),

                    fontFamily: 'NanumSquareOTFB',
                  }}
                >
                  {countsOfWords}
                </Text>{' '}
                words
              </Text>
              <Text
                style={{
                  color: '#111111',
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(1.6),
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'NanumSquareOTFB',
                  marginTop: responsiveScreenWidth(1),
                }}
              >
                The average learning score of words are{' '}
                <Text
                  style={{
                    color: '#F9AD3B',
                    fontWeight: 'bold',
                    fontSize: responsiveFontSize(1.6),
                    fontFamily: 'NanumSquareOTFB',
                  }}
                >
                  {averageScoreOfWords}
                </Text>{' '}
              </Text>
            </View>
          </Card>
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                transitionDuration={1000}
                source={require('../../assets/icons/sentence.png')}
              />
              <Text
                style={{
                  width: responsiveScreenWidth(65),
                  color: '#111111',
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(2.5),
                  marginLeft: responsiveScreenWidth(4),
                  fontFamily: 'NanumSquareOTFB',
                }}
              >
                Sentences
              </Text>
              <TouchableOpacity
                style={styles.goToLearnArrow}
                onPress={() => {
                  navigation.navigate('Stack', {
                    screen: 'Sentences Review',
                  });
                }}
              >
                <Ionicons size={30} color={'#444444'} name="chevron-forward-outline"></Ionicons>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: responsiveScreenWidth(1) }}>
              <Text
                style={{
                  color: '#111111',
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(1.6),
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'NanumSquareOTFB',
                }}
              >
                You have learned a total of{' '}
                <Text
                  style={{
                    color: '#3BA7F9',
                    fontWeight: 'bold',
                    fontSize: responsiveFontSize(1.6),

                    fontFamily: 'NanumSquareOTFB',
                  }}
                >
                  {countsOfSentences}
                </Text>{' '}
                sentences
              </Text>
              <Text
                style={{
                  color: '#111111',
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(1.6),
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'NanumSquareOTFB',
                  marginTop: responsiveScreenWidth(1),
                }}
              >
                The average learning score of sentences are{' '}
                <Text
                  style={{
                    color: '#3BA7F9',
                    fontWeight: 'bold',
                    fontSize: responsiveFontSize(1.6),
                    fontFamily: 'NanumSquareOTFB',
                  }}
                >
                  {averageScoreOfSentences}
                </Text>{' '}
              </Text>
            </View>
          </Card>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainText: {
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(2),
    marginLeft: responsiveScreenWidth(5),
    fontSize: responsiveFontSize(3.5),
    // fontFamily: 'NanumSquareOTFB',
    fontFamily: 'Playball-Regular',

    // fontWeight: 'bold',
    color: '#444444',
    // backgroundColor: 'black',
  },
  goToLearnArrow: {},
  thumbnailImage: {
    marginTop: responsiveScreenHeight(3),
    marginLeft: responsiveScreenWidth(4),
    width: responsiveScreenWidth(92.5),
    height: responsiveScreenHeight(12),
    borderRadius: 10,
  },
});

export default Review;

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
import Antdesign from 'react-native-vector-icons/AntDesign'; // AntDesign
import Icon2 from 'react-native-vector-icons/Feather'; // Feather
import Icon3 from 'react-native-vector-icons/MaterialIcons'; // MaterialIcons
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import RNFS from 'react-native-fs';
import { useFocusEffect, useIsFocused } from '@react-navigation/native'; // Navigation
import { Card, Divider } from 'react-native-elements'; // React Native Elements
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons
import { useNavigation } from '@react-navigation/native'; // Navigation
import { Picker } from '@react-native-picker/picker'; // React Native Picker

const SentencesReview = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [sentences, setSentences] = useState([]);
  const [randomNumber, setRandomNumber] = useState(Math.random());
  const [sortBy, setSortBy] = useState('latest_learning_at'); // bookmark_at(default) | latest_learning_at
  const [option, setOption] = useState('DESC'); // DESC(default)  | ASC

  // 리뷰 단어 불러오기
  const loadsentencesReview = () => {
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
          data: { success, sentences, tokenExpired, errorMessage },
        } = await axios.get(
          `https://dev.k-peach.io/review/sentences?${sortByQeury}&${optionQeury}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\nSentences: ${sentences}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting Sentences Reviews');

        setSentences(sentences);
        setIsLoading(() => false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 북마크 상태 변경 함수
  const addBookmark = ({ sentence }) => {
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
          `https://dev.k-peach.io/bookmark/sentences/${sentence.sentenceId}`,
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
          alert('Added from Bookmark');
        } else {
          alert('Deleted from Bookmark');
        }

        if (!success) throw new Error(errorMessage);
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(loadsentencesReview, [sortBy, option, randomNumber]);

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginBottom: responsiveScreenHeight(3) }}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: responsiveScreenHeight(2),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* 정렬 기능 (Sortby) */}
          {/* <TouchableOpacity
              onPress={() =>
                navigation.navigate('Stack', {
                  screen: 'Sort Options',
                  params: {
                    sortBy,
                  },
                })
              }
            > */}
          {/* <View
              style={{
                backgroundColor: '#EFEFEF',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                width: responsiveScreenWidth(10),
                height: responsiveScreenWidth(10),
              }}
            >
              <Ionicons color={'#000000'} size={30} name="options"></Ionicons>
            </View> */}
          <View
            style={{
              borderColor: '#000000',
              color: '#000000',
              paddingBottom: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingLeft: 0,
              borderRadius: 10,
              height: responsiveScreenHeight(6.5),
              width: responsiveScreenWidth(40),
              marginRight: responsiveScreenWidth(5),
            }}
          >
            <Picker
              style={{
                backgroundColor: '#FBFBFB',
                borderColor: '#000000',
                color: '#000000',
                height: responsiveScreenHeight(5),
                width: responsiveScreenWidth(40),
                paddingBottom: 0,
                paddingTop: 0,
                borderWidth: 1,
              }}
              selectedValue={sortBy}
              onValueChange={(itemValue, itemIndex) => setSortBy(itemValue)}
            >
              <Picker.Item
                style={{ fontSize: responsiveFontSize(1.5) }}
                label={'latest lerning at'}
                value={'latest_learning_at'}
                key={'latest_learning_at'}
              />
              <Picker.Item
                style={{ fontSize: responsiveFontSize(1.5) }}
                label={'average score'}
                value={'average_score'}
                key={'average_score'}
              />
              <Picker.Item
                style={{ fontSize: responsiveFontSize(1.5) }}
                label={'highest score'}
                value={'highest_score'}
                key={'highest_score'}
              />
            </Picker>
          </View>
          {/* </TouchableOpacity> */}

          {/* 정렬 기능 (Option) */}
          {/* <TouchableOpacity> */}
          {/* <View
              style={{
                backgroundColor: '#F3F3F3',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                width: responsiveScreenWidth(10),
                height: responsiveScreenWidth(10),
                marginLeft: responsiveScreenWidth(2),
              }}
            >
              <Ionicons
                color={'#000000'}
                size={25}
                name={option === 'DESC' ? 'arrow-down-outline' : 'arrow-up-outline'}
              ></Ionicons>
            </View> */}
          {/* </TouchableOpacity> */}
          <View
            style={{
              borderColor: '#000000',
              color: '#000000',
              paddingBottom: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingLeft: 0,
              borderRadius: 10,
              height: responsiveScreenHeight(6.5),
              width: responsiveScreenWidth(40),
            }}
          >
            <Picker
              style={{
                backgroundColor: '#FBFBFB',
                borderColor: '#000000',
                color: '#000000',
                height: responsiveScreenHeight(5),
                width: responsiveScreenWidth(40),
                paddingBottom: 0,
                paddingTop: 0,
                borderWidth: 1,
              }}
              selectedValue={option}
              onValueChange={(itemValue, itemIndex) => setOption(itemValue)}
            >
              <Picker.Item
                style={{ fontSize: responsiveFontSize(1.5) }}
                label={'Descending'}
                value={'DESC'}
                key={'DESC'}
              />
              <Picker.Item
                style={{ fontSize: responsiveFontSize(1.5) }}
                label={'Ascending'}
                value={'ASC'}
                key={'ASC'}
              />
            </Picker>
          </View>
        </View>
        {isLoading ? (
          <Text></Text>
        ) : (
          sentences.map((sentence) => {
            const navigation = useNavigation();
            const sentenceId = sentence.sentenceId;
            const contentId = sentence.contentId;
            const unitIndex = sentence.unitIndex;

            let latestLearningAt;
            if (sentence.latestLearningAt == null) {
              latestLearningAt = 'Not learned yet';
            } else {
              latestLearningAt = sentence.latestLearningAt.split('T');
              latestLearningAt = latestLearningAt[0];
            }
            if (sentence.highestScore == null) {
              sentence.highestScore = 0;
            }
            if (sentence.averageScore == null) {
              sentence.averageScore = 0;
            }
            return (
              <View
                style={{ flex: 1, marginBottom: responsiveScreenHeight(0.1) }}
                key={sentence.sentenceId}
              >
                <Card
                  containerStyle={{
                    borderWidth: 0.5,
                    borderRadius: 10,
                    backgroundColor: '#FBFBFB',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      zIndex: 1,
                      position: 'absolute',
                      top: 0,
                      right: responsiveScreenWidth(1),
                    }}
                    onPress={() => {
                      addBookmark({ sentence });
                      setRandomNumber(Math.random());
                    }}
                  >
                    <Antdesign
                      size={25}
                      color={sentence.isBookmark ? '#FFAD41' : '#AAAAAA'}
                      name={sentence.isBookmark ? 'star' : 'staro'}
                    ></Antdesign>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
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
                      <View>
                        <View>
                          <Text
                            style={{
                              color: '#444444',
                              width: responsiveScreenWidth(70),
                              fontSize: responsiveFontSize(2.2),
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {sentence.koreanText}
                          </Text>
                          <Text
                            style={{
                              color: '#444444',
                              fontSize: responsiveFontSize(2.2),
                              width: responsiveScreenWidth(70),
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {sentence.translatedText}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: responsiveScreenHeight(1),
                      }}
                    >
                      <Text
                        style={{
                          width: responsiveScreenWidth(32.65),
                          fontSize: responsiveFontSize(1.5),
                          paddingRight: 0,
                          color: '#444444',
                        }}
                      >
                        ▪︎Highest score :
                        <Text
                          style={{
                            fontSize: responsiveFontSize(1.5),
                            color: '#BBB2F9',
                            marginRight: 0,
                          }}
                        >
                          {' '}
                          {sentence.highestScore}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.5),
                          color: '#444444',
                          marginLeft: responsiveScreenWidth(5),
                        }}
                      >
                        ▪︎Average score :
                        <Text style={{ fontSize: responsiveFontSize(1.5), color: '#BBB2F9' }}>
                          {' '}
                          {sentence.averageScore}
                        </Text>
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: responsiveScreenHeight(1) }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.5),
                          color: '#444444',
                        }}
                      >
                        ▪︎Latest learned :
                        <Text style={{ fontSize: responsiveFontSize(1.5), color: '#BBB2F9' }}>
                          {' '}
                          {latestLearningAt}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </Card>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainText: {
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(3),
    marginLeft: responsiveScreenWidth(5),
    fontSize: responsiveFontSize(3),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#444444',
    // backgroundColor: 'black',
  },
  goToLearnArrow: {},
});

export default SentencesReview;

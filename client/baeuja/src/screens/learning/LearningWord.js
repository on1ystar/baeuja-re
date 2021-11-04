// Library import
import { element } from 'prop-types';
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component
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
import { Card } from 'react-native-elements'; // React Native Elements
import { useNavigation } from '@react-navigation/native'; // Navigation
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons
import Antdesign from 'react-native-vector-icons/AntDesign'; // AntDesign
import axios from 'axios'; // axios

// Component import
import WordTools from '../../components/learning/WordTools';
import { set } from 'react-native-reanimated';

const LearningWord = ({
  route: {
    params: { wordId },
  },
}) => {
  // state
  const [isLoading, setIsLoading] = useState(true);
  const [word, setWord] = useState({});
  const [exampleSentences, setExampleSentences] = useState([]);

  // word 가져오는 함수
  const loadWord = async () => {
    console.log(`load Word => word ID : ${wordId}`);
    // Word 데이터 조회
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }

        if (error) throw error;

        const {
          data: { sentences },
        } = await axios.get(`https://dev.k-peach.io/learning/words/${wordId}/sentences`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const {
          data: { success, word, tokenExpired, errorMessage },
        } = await axios.get(`https://dev.k-peach.io/learning/words/${wordId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\nword: ${word}\nsentences: ${sentences}`);

        if (!success) throw new Error(errorMessage);

        console.log('success getting Word Data');

        setWord(word);
        setExampleSentences(sentences);
        setIsLoading(() => false);
        console.log(exampleSentences);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // Bookmark 추가 함수
  const addBookmark = () => {
    AsyncStorage.getItem('token', async (error, token) => {
      // setBookmarkValue(!bookmarkValue);
      try {
        if (token === null) {
          // login으로 redirect
        }
        // AsyncStorage error
        if (error) throw error;
        console.log(wordId);
        const {
          data: { success, isBookmark },
        } = await axios.post(
          `https://dev.k-peach.io/bookmark/words/${wordId}`,
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

        const newWord = { ...word, isBookmark: !word.isBookmark };
        setWord(newWord);
        console.log(`Bookmark Post Success is :${success}`);
        console.log(`After Post, Word isBookmark is :${isBookmark}`);

        if (isBookmark) {
          alert('Added to Bookmark');
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
  useEffect(loadWord, []);

  // LearningWord 전체 return
  return (
    <View style={styles.allContainer}>
      {isLoading ? (
        <Text> </Text>
      ) : (
        <View style={styles.wordAllContainer}>
          <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
            <Text style={styles.koreanWord}>{word.korean}</Text>
            <Text style={styles.translatedWord}>{word.translation}</Text>
            <Text style={styles.wordImportance}>importance : {word.importance}</Text>
            <TouchableOpacity
              style={styles.wordBookmarkIcon}
              onPress={() => {
                addBookmark();
              }}
            >
              <Antdesign
                size={25}
                color={word.isBookmark ? '#FFAD41' : '#AAAAAA'}
                name={word.isBookmark ? 'star' : 'staro'}
              ></Antdesign>
            </TouchableOpacity>
          </Card>
          <View style={styles.wordToolsContainer}>
            <WordTools words={word} />
          </View>
          <ScrollView>
            <View style={{ marginTop: responsiveScreenHeight(5) }}>
              {exampleSentences.map((sentence) => (
                <DrawExampleSentences key={sentence.sentenceId} sentence={sentence} />
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

// 예시 문장 그리기
const DrawExampleSentences = ({ sentence }) => {
  const navigation = useNavigation();
  const contentId = sentence.contentId;
  const unitIndex = sentence.unitIndex;
  let koreanResult = [];

  // 예시 문장 정해진 단어에 색칠
  const drawKoreanSentence = () => {
    koreanResult = [sentence.koreanText];

    const resultKoreanhWords = [sentence.koreanInText];

    resultKoreanhWords.forEach((word) => {
      let idx;
      let temp = [];
      let findFlag = false;
      koreanResult.forEach((element) => {
        if (typeof element === 'string') {
          idx = element.indexOf(sentence.koreanInText);
          if (idx === -1 || findFlag === true) idx = undefined;
          else findFlag = true;
        }
        if (idx !== undefined) {
          temp.push(element.slice(0, idx));
          temp.push(
            // '(            )'
            <Text
              key={sentence.sentenceId}
              style={{
                fontSize: responsiveFontSize(1.75),
                color: '#4278A4',
                textDecorationLine: 'underline',
              }}
            >
              {sentence.koreanInText}
            </Text>
            // <Text
            //   style={{
            //     fontSize: responsiveFontSize(1.7),
            //     color: '#000000',
            //   }}
            // >
            //   ( )
            // </Text>

            // <View
            //   key={wordId}
            //   style={{
            //     backgroundColor: '#E7E7E7',
            //     borderRadius: 20,
            //     width: responsiveScreenWidth(15),
            //     height: responsiveScreenHeight(2.5),
            //   }}
            // ></View>
          );
          temp.push(element.slice(idx + sentence.koreanInText.length));
        } else {
          temp.push(element);
        }
        idx = undefined;
      });
      koreanResult = temp;
    });
    return koreanResult;
  };

  return (
    <Card
      containerStyle={{
        marginTop: responsiveScreenHeight(2),
        borderWidth: 0,
        borderRadius: 10,
        backgroundColor: '#FBFBFB',
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        <View>
          <Text style={styles.relatedKoreanSentences}>{drawKoreanSentence()}</Text>
          <Text style={styles.relatedEnglishSentences}>{sentence.translatedText}</Text>
        </View>
        <TouchableOpacity
          style={styles.goToLearnArrow}
          onPress={() => {
            navigation.navigate('Stack', {
              screen: 'Learning Unit',
              params: {
                contentId,
                unitIndex,
              },
            });
          }}
        >
          <Ionicons size={30} color={'#444444'} name="chevron-forward-outline"></Ionicons>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  wordAllContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    marginRight: 10,
  },
  koreanWord: {
    color: '#666666',
    fontSize: responsiveScreenFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  translatedWord: {
    color: '#666666',
    fontSize: responsiveScreenFontSize(2.2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    marginTop: responsiveScreenHeight(1),
  },
  wordImportance: {
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#9388E8',
    marginTop: responsiveScreenHeight(2),
  },
  wordToolsContainer: {
    marginTop: responsiveScreenHeight(5),
  },
  relatedKoreanSentences: {
    color: '#666666',
    fontSize: responsiveScreenFontSize(1.7),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    marginBottom: responsiveScreenHeight(2),
  },
  relatedEnglishSentences: {
    color: '#666666',
    fontSize: responsiveScreenFontSize(1.7),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  goToLearnArrow: {
    position: 'absolute',
    right: responsiveScreenWidth(-3),
    top: responsiveScreenHeight(1.25),
  },
  wordBookmarkIcon: {
    position: 'absolute',
    right: responsiveScreenWidth(0),
    top: responsiveScreenHeight(0),
  },
});

export default LearningWord;

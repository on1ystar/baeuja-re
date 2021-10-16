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
import axios from 'axios'; // axios

// Component import
import WordTools from '../../components/learning/WordTools';

const LearningWord = ({
  route: {
    params: { word },
  },
}) => {
  // state
  const [isLoading, setIsLoading] = useState(true);
  const [wordId, setWordId] = useState(word.wordId);
  const [words, setWords] = useState({});
  const [exampleSentences, setExampleSentences] = useState([]);

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
        } = await axios.get(`https://api.k-peach.io/learning/words/${wordId}/sentences`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const {
          data: { success, word, tokenExpired, errorMessage },
        } = await axios.get(`https://api.k-peach.io/learning/words/${wordId}`, {
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

        setWords(word);
        setExampleSentences(sentences);
        setIsLoading(() => false);
        console.log(words);
        console.log(exampleSentences);
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
        <View style={styles.allContainer}>
          <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
            <Text style={styles.koreanWord}>{words.korean}</Text>
            <Text style={styles.translatedWord}>{words.translation}</Text>
            <Text style={styles.wordImportance}>importance : {words.importance}</Text>
          </Card>
          <View style={styles.wordToolsContainer}>
            <WordTools words={words} />
          </View>
          <View style={{ marginTop: responsiveScreenHeight(5) }}>
            {exampleSentences.map((sentence) => (
              <DrawExampleSentences key={sentence.sentenceId} sentence={sentence} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const DrawExampleSentences = ({ sentence }) => {
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
          <Text style={styles.relatedKoreanSentences}>{sentence.koreanText}</Text>
          <Text style={styles.relatedEnglishSentences}>{sentence.translatedText}</Text>
        </View>
        <TouchableOpacity style={styles.goToLearnArrow}>
          <Ionicons size={30} name="chevron-forward-outline"></Ionicons>
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
});

export default LearningWord;

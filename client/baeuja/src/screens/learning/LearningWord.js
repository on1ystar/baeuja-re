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
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons

// Component import
import WordTools from '../../components/learning/WordTools';

const LearningWord = ({
  route: {
    params: { word },
  },
}) => {
  //   useEffect(getWordData, []);

  const [words, setWords] = useState();

  const getWordData = () => {
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: { success, words },
        } = await axios(`https://api.k-peach.io/learning/words/${word.wordId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // if (tokenExpired) {
        //   // login으로 redirect
        // }

        if (!success) throw new Error(errorMessage);

        setWords(words);

        console.log('Success getting Words Data');
      } catch (error) {
        console.log(error);
      }
    });
  };
  // LearningWord 전체 return
  return (
    <View style={styles.allContainer}>
      <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
        <View>
          <Text style={styles.koreanWord}>{word.originalKoreanText}</Text>
          <Text style={styles.translatedWord}>{word.originalTranslatedText}</Text>
          <Text style={styles.wordImportance}>importance : A</Text>
        </View>
      </Card>
      <View style={styles.wordToolsContainer}>
        <WordTools words={words} />
      </View>
      <View>
        <Card
          containerStyle={{
            marginTop: responsiveScreenHeight(50),
            borderWidth: 0,
            borderRadius: 10,
            backgroundColor: '#FBFBFB',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Text style={styles.relatedKoreanSentences}>
                words[0].relatedSentences[0].koreanText
              </Text>
              <Text style={styles.relatedEnglishSentences}>
                words[0].relatedSentences[0].translatedText
              </Text>
            </View>
            <View>
              <TouchableOpacity>
                <Ionicons
                  style={styles.goToLearnArrow}
                  size={30}
                  name="chevron-forward-outline"
                ></Ionicons>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>
    </View>
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
    fontSize: responsiveScreenFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  translatedWord: {
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
    fontSize: responsiveScreenFontSize(1.7),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    marginBottom: responsiveScreenHeight(2),
  },
  relatedEnglishSentences: {
    fontSize: responsiveScreenFontSize(1.7),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  goToLearnArrow: {
    position: 'absolute',
    right: responsiveWidth(-10),
    top: responsiveScreenHeight(1),
  },
});

export default LearningWord;

import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
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
import { Divider } from 'react-native-elements'; // Elements
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage

// 새로운 콘텐츠 가져오기
const GetRecommandWords = ({ randomNumber }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendationWords, SetRecommendationWords] = useState();
  let key = 1;

  const loadRecommendationWords = () => {
    console.log(`Load New Contents ...`);

    // New Contents 데이터 조회
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: { success, words, tokenExpired, errorMessage },
        } = await axios.get(`https://api.k-peach.io/home/recommendations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\nwords: ${words}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting Recommendation Words');

        SetRecommendationWords(words);
        setIsLoading(() => false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(loadRecommendationWords, [randomNumber]);

  // GetRecommandWords return 부분
  return (
    <View style={{ marginLeft: responsiveScreenWidth(5) }}>
      {isLoading ? (
        <Text> </Text>
      ) : (
        recommendationWords.map((word) => <DrawRecommandWords key={word.wordId} word={word} />)
      )}
    </View>
  );
};

// 새로운 콘텐츠 그리기
const DrawRecommandWords = ({ word }) => {
  const sameRecommandWord = word.sentences;

  return (
    <View style={styles.recommandWordsAllContainer}>
      <View style={styles.recommandWordsContainer}>
        <View style={styles.recommandWordTextContainer}>
          <Text style={styles.recommandWord}>#{word.korean}</Text>
          <Text style={styles.recommandWordImportance}>Importance {word.importance}</Text>
        </View>
        <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false}>
          {sameRecommandWord.map((sentences) => (
            <DrawSameRecommandWords key={sentences.sentenceId} sentences={sentences} />
          ))}
          {/* </TouchableOpacity> */}
        </ScrollView>
      </View>
    </View>
  );
};

const DrawSameRecommandWords = ({ sentences }) => {
  const navigation = useNavigation();
  const contentId = sentences.contentId;
  const unitIndex = sentences.unitIndex;

  return (
    <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.recommandWordContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Stack', {
              screen: 'LearningUnit',
              params: {
                contentId,
                unitIndex,
              },
            })
          }
        >
          <Image
            transitionDuration={1000}
            source={{
              uri: sentences.thumbnailUri,
            }}
            style={styles.thumbnailImage}
          />
          <View style={styles.recommandWordKoreanSentenceContainer}>
            <Text style={styles.newWordSentence} numberOfLines={1} ellipsizeMode="tail">
              {sentences.koreanText}
            </Text>
          </View>
          <View style={styles.recommandWordEnglishSentenceContainer}>
            <Text style={styles.newWordSentence} numberOfLines={1} ellipsizeMode="tail">
              {sentences.translatedText}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  recommandWordsAllContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  recommandWordsContainer: {
    // marginRight: responsiveScreenWidth(7),
  },
  recommandWordTextContainer: {
    flexDirection: 'row',
    marginTop: responsiveScreenHeight(3),
    width: responsiveScreenWidth(80),
  },
  recommandWord: {
    justifyContent: 'flex-start',
    fontSize: responsiveFontSize(2.3),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#3095F9',
    // backgroundColor: 'black',
  },
  recommandWordImportance: {
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#9388E8',
    position: 'absolute',
    left: responsiveScreenWidth(30),
    top: responsiveScreenHeight(0.5),
  },
  recommandWordContainer: {
    // width: responsiveScreenWidth(100),
    marginTop: responsiveScreenHeight(2),
    marginRight: responsiveScreenWidth(5),
  },
  recommandWordKoreanSentenceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(1.5),
  },
  recommandWordEnglishSentenceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(0.5),
  },
  newWordSentence: {
    color: '#000000',
    width: responsiveScreenWidth(80),
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  recommandWordSentenceInfo: {
    fontSize: responsiveScreenFontSize(1.5),
    marginTop: responsiveScreenHeight(0.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#9388E8',
  },
  thumbnailImage: {
    width: responsiveScreenWidth(80),
    height: responsiveScreenHeight(20),
    borderRadius: 10,
  },
  infoIconContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'center',
    // backgroundColor: '#000000',
  },
});

export default GetRecommandWords;

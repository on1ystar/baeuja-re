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
  const [recommendationWords, setRecommendationWords] = useState([]);
  const [recommendationWordIds, setRecommendationWordIds] = useState([]);

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

        let temp = [];
        const wordsIdList = words.map((word) => word.wordId);
        words.forEach((word) => {
          if (
            recommendationWordIds.indexOf(word.wordId) === -1 &&
            words.filter((e) => e.wordId === word.wordId).length === 1
          ) {
            temp.push(word);
          }
        });
        setRecommendationWords(recommendationWords.concat(temp));
        setRecommendationWordIds(recommendationWordIds.concat(temp.map((word) => word.wordId)));
        setIsLoading(() => false);
        // setRecommendationWords(words);
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(loadRecommendationWords, [randomNumber]);

  // GetRecommandWords return 부분
  return (
    <ScrollView style={{ marginLeft: responsiveScreenWidth(5) }}>
      {isLoading ? (
        <Text style={{ color: '#444444' }}> Loading... Please wait...</Text>
      ) : (
        recommendationWords.map((word) => <DrawRecommandWords key={word.wordId} word={word} />)
      )}
    </ScrollView>
    // <View style={styles.recommandWordsAllContainer}>
    //   {console.log('Rendering FlatList')}
    //   <FlatList
    //     style={{ flex: 1 }}
    //     data={recommendationWords}
    //     renderItem={DrawRecommandWords}
    //     keyExtractor={(word) => word.wordId}
    //     onEndReached={loadRecommendationWords}
    //     // windowSize={1}
    //     // extraData={selectedId}
    //   />
    // </View>
  );
};

// 새로운 콘텐츠 그리기
const DrawRecommandWords = ({ word }) => {
  const navigation = useNavigation();
  const sameRecommandWord = word.sentences;
  const wordId = word.wordId;
  return (
    <View>
      {/* {isLoading ? (
        <Text> </Text>
      ) : ( */}
      <View style={styles.recommandWordsContainer}>
        <View style={styles.recommandWordTextContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Stack', {
                screen: 'LearningWord',
                params: {
                  wordId,
                },
              })
            }
          >
            <Text style={styles.recommandWord}>#{word.korean}</Text>
          </TouchableOpacity>
          <Text style={styles.recommandWordImportance}>importance {word.importance}</Text>
        </View>
        <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false}>
          {sameRecommandWord.map((sentences) => (
            <DrawSameRecommandWords
              key={`${word.wordId}-${sentences.sentenceId}`}
              sentences={sentences}
              word={word}
            />
          ))}
        </ScrollView>
      </View>
      {/* )} */}
    </View>
  );
};

const DrawSameRecommandWords = ({ sentences, word }) => {
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
          {/* <Image
            transitionDuration={1000}
            source={{
              uri: sentences.thumbnailUri,
            }}
            style={styles.thumbnailImage}
          /> */}
          {/* <Image
            transitionDuration={1000}
            source={require('../../assets/img/kpopunit.png')}
            style={styles.thumbnailImage}
          /> */}

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
        <Divider
          style={{ width: '107%', marginTop: responsiveScreenHeight(2) }}
          color="#EEEEEE"
          insetType="middle"
          width={4}
          orientation="horizontal"
        />
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
    fontSize: responsiveFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#4278A4',
    // backgroundColor: 'black',
  },
  recommandWordImportance: {
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '600',
    color: '#999999',
    position: 'absolute',
    fontSize: responsiveFontSize(1.5),
    left: responsiveScreenWidth(65),
    top: responsiveScreenHeight(1),
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
    color: '#444444',
    width: responsiveScreenWidth(80),
    fontSize: responsiveScreenFontSize(1.7),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '600',
  },
  recommandWordSentenceInfo: {
    fontSize: responsiveScreenFontSize(1.5),
    marginTop: responsiveScreenHeight(0.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#9388E8',
  },
  thumbnailImage: {
    width: responsiveScreenWidth(87),
    height: responsiveScreenHeight(22),
    borderRadius: 10,
  },
  infoIconContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'center',
    // backgroundColor: '#000000',
  },
});

export default GetRecommandWords;

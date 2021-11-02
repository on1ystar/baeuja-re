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
import { Divider, Card } from 'react-native-elements'; // Elements
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage

// 추천 단어 가져오기
const GetRecommandWords = ({ randomNumber }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendationWords, setRecommendationWords] = useState([]);
  const [recommendationWordIds, setRecommendationWordIds] = useState([]);

  const loadRecommendationWords = () => {
    console.log(`Load New Contents ...`);

    // 추천 단어 데이터 요청
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: { success, words, tokenExpired, errorMessage },
        } = await axios.get(`https://dev.k-peach.io/home/recommendations`, {
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
    <ScrollView>
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

// 추천 단어 그리기
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
  let koreanResult = [];
  let englishResult = [];
  let wordId = word.wordId;

  // 한국어 문장에 빈칸 뚫기
  const drawKoreanSentence = () => {
    koreanResult = [sentences.koreanText];

    const resultKoreanhWords = [sentences.koreanInText];

    resultKoreanhWords.forEach((word) => {
      let idx;
      let temp = [];
      let findFlag = false;
      koreanResult.forEach((element) => {
        if (typeof element === 'string') {
          idx = element.indexOf(sentences.koreanInText);
          if (idx === -1 || findFlag === true) idx = undefined;
          else findFlag = true;
        }
        if (idx !== undefined) {
          temp.push(element.slice(0, idx));
          temp.push(
            // <Text
            //   style={{
            //     fontSize: responsiveFontSize(1.7),
            //     color: '#000000',
            //   }}
            // >
            //   ( )
            // </Text>
            <View
              key={wordId}
              style={{
                backgroundColor: '#E7E7E7',
                borderRadius: 20,
                width: responsiveScreenWidth(15),
                height: responsiveScreenHeight(2.5),
              }}
            ></View>
          );
          temp.push(element.slice(idx + sentences.koreanInText.length));
        } else {
          temp.push(element);
        }
        idx = undefined;
      });
      koreanResult = temp;
    });
    return koreanResult;
  };

  // 영어 문장에 빈칸 뚫기
  const drawEnglishSentence = () => {
    englishResult = [sentences.translatedText];

    let wordId = word.wordId;
    const resultEnglishWords = [sentences.translationInText];

    resultEnglishWords.forEach((word) => {
      let idx;
      let temp = [];
      englishResult.forEach((element) => {
        if (typeof element === 'string') {
          idx =
            element.toLowerCase().indexOf(sentences.translationInText.toLowerCase()) === -1
              ? undefined
              : element.toLowerCase().indexOf(sentences.translationInText.toLowerCase());
        }
        if (idx !== undefined) {
          temp.push(element.slice(0, idx));
          temp.push(
            // <Text
            //   key={word.wordId}
            //   style={{
            //     fontSize: responsiveFontSize(2.1),
            //     color: '#4278A4',
            //     textDecorationLine: 'underline',
            //   }}
            // >
            //   {word.translationInText}
            // </Text>
            <View
              key={wordId}
              style={{
                backgroundColor: '#E7E7E7',
                borderRadius: 20,
                width: responsiveScreenWidth(15),
                height: responsiveScreenHeight(2.5),
              }}
            ></View>
          );
          temp.push(element.slice(idx + sentences.translationInText.length));
        } else {
          temp.push(element);
        }
        idx = undefined;
      });
      englishResult = temp;
    });
    return englishResult;
  };

  return (
    <ScrollView horizontal nestedScrollEnabled={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.recommandWordContainer}>
        <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
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
              {/* <Text style={styles.newWordSentence} numberOfLines={1} ellipsizeMode="tail">
              {sentences.koreanText}
            </Text> */}
              <Text style={styles.newWordSentence} numberOfLines={2} ellipsizeMode="tail">
                {drawKoreanSentence()}
              </Text>
            </View>
            <View style={styles.recommandWordEnglishSentenceContainer}>
              {/* <Text style={styles.newWordSentence} numberOfLines={1} ellipsizeMode="tail">
              {sentences.translatedText}
            </Text> */}
              <Text style={styles.newWordSentence} numberOfLines={2} ellipsizeMode="tail">
                {drawEnglishSentence()}
              </Text>
            </View>
          </TouchableOpacity>
        </Card>
        <Divider
          style={{
            marginLeft: responsiveScreenWidth(5),
            width: '107%',
            marginTop: responsiveScreenHeight(2),
          }}
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
    marginTop: responsiveScreenHeight(2),
    marginLeft: responsiveScreenWidth(5),
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
    // marginTop: responsiveScreenHeight(2),
    height: responsiveScreenHeight(17),
    marginRight: responsiveScreenWidth(-3),
  },
  recommandWordKoreanSentenceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveScreenHeight(1.5),
  },
  recommandWordEnglishSentenceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(0.5),
  },
  newWordSentence: {
    justifyContent: 'center',
    alignItems: 'center',
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

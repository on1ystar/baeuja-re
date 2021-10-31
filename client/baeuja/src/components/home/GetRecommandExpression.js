import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
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

// 추천 표현 가져오기
const GetRecommandExpression = () => {
  const navigation = useNavigation();
  AsyncStorage.getItem('token', async (error, token) => {
    try {
      // 토큰이 없는 경우 login으로 redirect
      if (token === null) {
        navigation.dispatch(
          CommonActions.navigate('Stack', {
            screen: 'Login',
          })
        );
      }
      if (error) throw error;

      const {
        data: { success, contents, tokenExpired, errorMessage },
      } = await axios('https://api.k-peach.io/learning/contents', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 토큰이 만료된 경우 login으로 redirect
      // if (tokenExpired) {
      // }

      if (!success) throw new Error(errorMessage);

      console.log('success getting contents');
      // this.setState({ isLoading: false, contents });
    } catch (error) {
      console.log(error);
    }
  });

  // GetRecommandExpression return 부분
  return (
    <View>
      <DrawRecommandExpression />
    </View>
  );
};

// 추천 표현 그리기
const DrawRecommandExpression = () => {
  return (
    <View style={styles.recommandExpressionAllContainer}>
      <View style={styles.recommandExpressionContainer}>
        <View style={styles.recommandWordTextContainer}>
          <Text style={styles.recommandWord}>#질문 있습니다</Text>
        </View>
        <View style={styles.recommandWordContainer}>
          <Image
            transitionDuration={1000}
            source={require('../../assets/img/squidgamethumbnail.jpg')}
            style={styles.thumbnailImage}
          />
          <View style={styles.recommandWordKoreanSentenceContainer}>
            <Text style={styles.newWordSentence} numberOfLines={1} ellipsizeMode="tail">
              저기요, 질문 있습니다
            </Text>
          </View>
          <View style={styles.recommandWordEnglishSentenceContainer}>
            <Text style={styles.newWordSentence} numberOfLines={1} ellipsizeMode="tail">
              Hey, I have a question.
            </Text>
          </View>
          <View>
            <Text style={styles.recommandWordSentenceInfo}>Squid Game - Expression. 3</Text>
          </View>
        </View>
      </View>
      {/*컨텐츠 구분 */}
      <View style={styles.recommandExpressionContainer}>
        <View style={styles.recommandWordTextContainer}>
          <Text style={styles.recommandWord}>#너는 계획이 다 있구나</Text>
        </View>
        <View style={styles.recommandWordContainer}>
          <Image
            transitionDuration={1000}
            source={require('../../assets/img/parasitefamousline1.jpeg')}
            style={styles.thumbnailImage}
          />
          <View style={styles.recommandWordKoreanSentenceContainer}>
            <Text style={styles.newWordSentence} numberOfLines={1} ellipsizeMode="tail">
              아들아, 너는 계획이 다 있구나
            </Text>
          </View>
          <View style={styles.recommandWordEnglishSentenceContainer}>
            <Text style={styles.newWordSentence} numberOfLines={1} ellipsizeMode="tail">
              Son, you have a plan.
            </Text>
          </View>
          <View>
            <Text style={styles.recommandWordSentenceInfo}>Parasite - Famous Line. 1</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recommandExpressionAllContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  recommandExpressionContainer: {
    marginRight: responsiveScreenWidth(7),
  },
  recommandWordTextContainer: {
    flexDirection: 'row',
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
    left: responsiveScreenWidth(57),
    top: responsiveScreenHeight(0.5),
  },
  recommandWordContainer: {
    marginTop: responsiveScreenHeight(2),
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
    fontSize: responsiveScreenFontSize(2.2),
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

export default GetRecommandExpression;

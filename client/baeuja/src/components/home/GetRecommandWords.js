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

// 새로운 콘텐츠 가져오기
const GetRecommandWords = () => {
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

  // GetNewContents return 부분
  return (
    <View>
      <DrawRecommandWords />
    </View>
  );
};

// 새로운 콘텐츠 그리기
const DrawRecommandWords = () => {
  return (
    <View style={styles.recommandWordsAllContainer}>
      <View style={styles.recommandWordsContainer}>
        <View style={styles.recommandWordTextContainer}>
          <Text style={styles.recommandWord}>#첫 눈</Text>
          <Text style={styles.recommandWordImportance}>Importance B</Text>
        </View>
        <View style={styles.recommandWordContainer}>
          <Image
            transitionDuration={1000}
            source={require('../../assets/img/bts.png')}
            style={styles.thumbnailImage}
          />
          <View style={styles.recommandWordKoreanSentenceContainer}>
            <Text style={styles.newWordSentence} numberOfLines={1} ellipsizeMode="tail">
              ( {'       '} )에 널 알아보게 됐어
            </Text>
          </View>
          <View style={styles.recommandWordEnglishSentenceContainer}>
            <Text style={styles.newWordSentence} numberOfLines={1} ellipsizeMode="tail">
              I recognized you at first sight
            </Text>
          </View>
          <View>
            <Text style={styles.recommandWordSentenceInfo}>BTS - DNA - Unit. 1</Text>
          </View>
        </View>
      </View>
      {/* 컨텐츠 구분 */}
      <View style={styles.recommandWordsContainer}>
        <View style={styles.recommandWordTextContainer}>
          <Text style={styles.recommandWord}>#생각</Text>
          <Text style={styles.recommandWordImportance}>Importance A</Text>
        </View>
        <View style={styles.recommandWordContainer}>
          <Image
            transitionDuration={1000}
            source={require('../../assets/img/blackpink.jpg')}
            style={styles.thumbnailImage}
          />
          <View style={styles.recommandWordKoreanSentenceContainer}>
            <Text style={styles.newWordSentence} numberOfLines={1} ellipsizeMode="tail">
              너 뭔데 자꾸 ( {'       '} )나
            </Text>
          </View>
          <View style={styles.recommandWordEnglishSentenceContainer}>
            <Text style={styles.newWordSentence} numberOfLines={1} ellipsizeMode="tail">
              I keep thinking of you
            </Text>
          </View>
          <View>
            <Text style={styles.recommandWordSentenceInfo}>BLACK PINK - 마지막처럼 - Unit. 1</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recommandWordsAllContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  recommandWordsContainer: {
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

export default GetRecommandWords;

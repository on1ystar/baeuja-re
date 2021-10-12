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
const GetNewContents = () => {
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
      <DrawNewContents />
    </View>
  );
};

// 새로운 콘텐츠 그리기
const DrawNewContents = () => {
  return (
    <View style={styles.newContentsContainer}>
      <View style={styles.kdramaContainer}>
        <Image
          transitionDuration={1000}
          source={require('../../assets/img/squidgame.jpg')}
          style={styles.thumbnailImage}
        />
        <View style={styles.kdramaTitleContainer}>
          <Text style={styles.kdramaTitle} numberOfLines={1} ellipsizeMode="tail">
            SQUID GAME
          </Text>
        </View>
        <View>
          <Text style={styles.newContentsInfo}>12 Expression | 24 Words</Text>
        </View>
      </View>
      <View style={styles.kdramaContainer}>
        <Image
          transitionDuration={1000}
          source={require('../../assets/img/kingdom.jpg')}
          style={styles.thumbnailImage}
        />
        <View style={styles.kdramaTitleContainer}>
          <Text style={styles.kdramaTitle} numberOfLines={1} ellipsizeMode="tail">
            KINGDOM
          </Text>
        </View>
        <View>
          <Text style={styles.newContentsInfo}>6 Expression | 12 Words</Text>
        </View>
      </View>
      <View style={styles.kdramaContainer}>
        <Image
          transitionDuration={1000}
          source={require('../../assets/img/minari.jpeg')}
          style={styles.thumbnailImage}
        />
        <View style={styles.kdramaTitleContainer}>
          <Text style={styles.kdramaTitle} numberOfLines={1} ellipsizeMode="tail">
            MINARI
          </Text>
        </View>
        <View>
          <Text style={styles.newContentsInfo}>7 Expression | 10 Words</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newContentsContainer: {
    marginTop: responsiveScreenHeight(2),
    marginLeft: responsiveScreenWidth(5),
    flexDirection: 'row',
  },
  kdramaContainer: {
    marginRight: 20,
  },
  kdramaTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  kdramaTitle: {
    width: responsiveScreenWidth(30),
    fontSize: responsiveScreenFontSize(2.2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  newContentsInfo: {
    fontSize: responsiveScreenFontSize(1.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#9388E8',
  },
  thumbnailImage: {
    width: 150,
    height: 170,
    borderRadius: 10,
  },
  infoIconContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'center',
    // backgroundColor: '#000000',
  },
});

export default GetNewContents;

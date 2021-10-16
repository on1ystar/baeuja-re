// Library import
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
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

// Component import
import GetNewContents from '../../components/home/GetNewContents';
import GetRecommandWords from '../../components/home/GetRecommandWords';
import GetRecommandExpression from '../../components/home/GetRecommandExpression';

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [randomNumber, setRandomNumber] = useState(Math.random()); // 새로고침용 변수

  // 새로고침 2초 기다리기
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRandomNumber(randomNumber + 1);
    wait(2000).then(() => setRefreshing(false));
  }, [randomNumber]);

  // Home Screen 전체 렌더링
  return (
    <ScrollView
      refreshControl={
        <RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.container}
    >
      <View style={styles.newTextConatainer}>
        <Text>
          <Ionicons size={30} color={'#FFE500'} name="sunny"></Ionicons>
          <Text style={styles.mainText}>New</Text> <Text style={{ color: '#000000' }}>(4)</Text>
        </Text>
      </View>
      <ScrollView nestedScrollEnabled={true} horizontal showsHorizontalScrollIndicator={false}>
        <GetNewContents />
      </ScrollView>
      <Divider
        style={{ width: '100%', marginTop: responsiveScreenHeight(1) }}
        color="#EEEEEE"
        insetType="middle"
        width={1}
        orientation="horizontal"
      />
      <ScrollView
        nestedScrollEnabled={true}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.recommendWordConatainer}
      >
        <GetRecommandWords randomNumber={randomNumber} />
      </ScrollView>
      <Divider
        style={{ width: '100%', marginTop: responsiveScreenHeight(1) }}
        color="#EEEEEE"
        insetType="middle"
        width={1}
        orientation="horizontal"
      />
      <ScrollView
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={styles.recommendExpressionConatainer}
      >
        <GetRecommandExpression />
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newTextConatainer: {
    marginTop: responsiveScreenHeight(7),
    marginLeft: responsiveScreenWidth(5),
  },
  mainText: {
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(7),
    marginLeft: responsiveScreenWidth(5),
    fontSize: responsiveFontSize(2.7),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#9388E8',
    // backgroundColor: 'black',
  },
  recommendWordConatainer: {
    marginTop: responsiveScreenHeight(2),
    marginLeft: responsiveScreenWidth(5),
    flexDirection: 'row',
  },
  recommendExpressionConatainer: {
    marginTop: responsiveScreenHeight(2),
    marginLeft: responsiveScreenWidth(5),
  },
});

export default Home;

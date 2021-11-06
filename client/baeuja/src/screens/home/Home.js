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

// Component import
import GetNewContents from '../../components/home/GetNewContents';
import GetRecommandWords from '../../components/home/GetRecommandWords';
import GetRecommandExpression from '../../components/home/GetRecommandExpression';
import InfiniteScrollTest from '../../components/home/InfiniteScrollTest';

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [randomNumber, setRandomNumber] = useState(Math.random()); // 새로고침용 변수

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 40;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };
  // 새로고침 2초 기다리기
  // const wait = (timeout) => {
  //   return new Promise((resolve) => setTimeout(resolve, timeout));
  // };

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   setRandomNumber(randomNumber + 1);
  //   wait(2000).then(() => setRefreshing(false));
  // }, [randomNumber]);

  // Home Screen 전체 렌더링
  return (
    <ScrollView
      style={styles.container}
      nestedScrollEnabled={true}
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          setRandomNumber(Math.random());
        }
      }}
      scrollEventThrottle={100}
      // refreshControl={
      //   <RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />
      // }
    >
      <Text style={styles.mainText}>New</Text>
      {/* <Divider
        style={{ width: responsiveScreenWidth(100), marginTop: responsiveScreenHeight(1) }}
        color="#EEEEEE"
        insetType="middle"
        width={1}
        orientation="horizontal"
      /> */}
      <ScrollView nestedScrollEnabled={true} horizontal showsHorizontalScrollIndicator={false}>
        <GetNewContents />
      </ScrollView>
      <Divider
        style={{ width: '100%', marginTop: responsiveScreenHeight(0) }}
        color="#EEEEEE"
        insetType="middle"
        width={1}
        orientation="horizontal"
      />
      <GetRecommandWords randomNumber={randomNumber} />
      <Divider
        style={{ width: '100%', marginTop: responsiveScreenHeight(1) }}
        color="#EEEEEE"
        insetType="middle"
        width={1}
        orientation="horizontal"
      />
      {/*추천 문장 그리기 컴포넌트 */}
      {/* <ScrollView
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        horizontal
        style={styles.recommendExpressionConatainer}
      >
        <GetRecommandExpression />
      </ScrollView> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: responsiveScreenHeight(10),
  },
  mainText: {
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(2),
    paddingLeft: responsiveScreenWidth(5),
    paddingBottom: responsiveScreenHeight(1),
    // marginLeft: responsiveScreenWidth(5),
    fontSize: responsiveFontSize(3.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    // fontFamily: 'Playball-Regular',
    color: '#9388E8',
    // marginRight: responsiveScreenWidth(5),
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 3,
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

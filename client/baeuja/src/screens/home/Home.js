// Library import
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
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
  return (
    <ScrollView style={styles.container}>
      <View style={styles.newTextConatainer}>
        <Text>
          <Text style={styles.mainText}>✨ New</Text> (4)
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <GetNewContents />
      </ScrollView>
      <Divider
        style={{ width: '100%', marginTop: 10 }}
        color="#EEEEEE"
        insetType="middle"
        width={1}
        orientation="horizontal"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.recommendWordConatainer}
      >
        <GetRecommandWords />
      </ScrollView>
      <Divider
        style={{ width: '100%', marginTop: 10 }}
        color="#EEEEEE"
        insetType="middle"
        width={1}
        orientation="horizontal"
      />
      <ScrollView
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

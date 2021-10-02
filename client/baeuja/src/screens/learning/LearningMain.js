/* eslint-disable react/prop-types */
// Library impoer
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native'; // React Native Component
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
  useResponsiveFontSize,
} from 'react-native-responsive-dimensions'; // React Native Responsive Layout
import { Divider } from 'react-native-elements'; // Elements

// 컴포넌트
import GetLearningContents from '../../components/learning/GetLearningContents';

class LearningMain extends React.Component {
  render() {
    return (
      <ScrollView style={styles.allContainer}>
        <Text style={styles.mainText}>Learning</Text>
        <Divider
          style={{ width: '100%', marginTop: 10 }}
          color="#dddddd"
          insetType="middle"
          width={2}
          orientation="horizontal"
        />
        <Text style={styles.titleText}>K-POP</Text>
        <GetLearningContents />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
  },
  mainText: {
    justifyContent: 'flex-start',
    marginTop: 45,
    marginLeft: 22,
    fontSize: responsiveFontSize(3.2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#9388E8',
    // backgroundColor: 'black',
  },
  cardContainer: {},
  cardTitle: {
    color: '#6150E2',
    fontSize: responsiveFontSize(2.7),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    textAlign: 'left',
    // backgroundColor: 'black',
    // width: responsiveScreenWidth(20),
  },
  infoButton: {
    position: 'absolute',
    marginLeft: 290,
    backgroundColor: 'black',
  },
  titleText: {
    justifyContent: 'flex-start',
    marginTop: 20,
    marginLeft: 22,
    fontSize: responsiveFontSize(2.8),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#555555',
    // backgroundColor: 'black',
  },
});

export default LearningMain;

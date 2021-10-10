/* eslint-disable react/prop-types */
// Library import
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'; // React Native Component
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
import { useNavigation } from '@react-navigation/native'; // Navigation

// Component import
import GetLearningContents from '../../components/learning/GetLearningContents';
import GetKdramaLearningContents from '../../components/learning/GetKdramaLearningContents';
import GetKmovieLearningContents from '../../components/learning/GetKmovieLearningContents';

class LearningMain extends React.Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.allContainer}>
        <Text style={styles.mainText}>Learning</Text>
        <Divider
          style={{ width: '100%', marginTop: 10 }}
          color="#EEEEEE"
          insetType="middle"
          width={1}
          orientation="horizontal"
        />
        <View style={styles.kpopTextContainer}>
          <Text style={styles.titleText}>K-POP</Text>
          <TouchableOpacity
            style={styles.moreText}
            onPress={() =>
              navigate('Stack', {
                screen: 'GetKpopLearningContents',
              })
            }
          >
            <Text>more</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.kpopScrollViewContainer}>
          <GetLearningContents />
        </ScrollView>
        <Divider
          style={{ width: '100%', marginTop: 10 }}
          color="#EEEEEE"
          insetType="middle"
          width={1}
          orientation="horizontal"
        />
        <Text style={styles.titleText}>K-Drama</Text>
        <ScrollView style={styles.kdramaScrollViewContainer}>
          <View style={styles.kdramaScrollViewHider}>
            <GetKdramaLearningContents />
          </View>
          <Text style={styles.comingSoon}>Coming Soon...</Text>
        </ScrollView>
        <Divider
          style={{ width: '100%', marginTop: 10 }}
          color="#EEEEEE"
          insetType="middle"
          width={1}
          orientation="horizontal"
        />
        <Text style={styles.titleText}>K-Movie</Text>
        <ScrollView style={styles.kmovieScrollViewContainer}>
          <View style={styles.kmovieScrollViewHider}>
            <GetKmovieLearningContents />
          </View>
          <Text style={styles.comingSoon}>Coming Soon...</Text>
        </ScrollView>
      </View>
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
  kpopTextContainer: {
    width: responsiveScreenWidth(100),
    flexDirection: 'row',
  },
  moreText: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: responsiveScreenWidth(60),
  },
  kpopScrollViewContainer: {
    flex: 1,
  },
  kdramaScrollViewContainer: {
    flex: 1,
  },
  kdramaScrollViewHider: {
    opacity: 0.3,
    backgroundColor: '#FFFFFF',
  },
  kmovieScrollViewHider: {
    opacity: 0.3,
    backgroundColor: '#FFFFFF',
  },
  comingSoon: {
    position: 'absolute',
    color: '#000000',
    fontSize: responsiveFontSize(4),
    left: responsiveScreenWidth(25),
    top: responsiveScreenHeight(7),
    fontWeight: 'bold',
  },
  kmovieScrollViewContainer: {
    flex: 1,
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

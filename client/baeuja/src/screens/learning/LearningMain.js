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
  FlatList,
  SafeAreaView,
} from 'react-native'; // React Native Component
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
  useResponsiveScreenWidth,
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
          style={{ width: '100%', marginTop: responsiveScreenHeight(1) }}
          color="#EEEEEE"
          insetType="middle"
          width={1}
          orientation="horizontal"
        />
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={styles.kpopTextContainer}>
              <Text style={styles.titleText}>K-Pop</Text>
              <TouchableOpacity
                style={styles.moreText}
                onPress={() =>
                  navigate('Stack', {
                    screen: 'GetKpopLearningContents',
                  })
                }
              >
                <Text style={{ color: '#666666', fontWeight: 'bold' }}>more</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: responsiveScreenHeight(44) }}>
              <ScrollView nestedScrollEnabled={true} style={styles.kpopScrollViewContainer}>
                <GetLearningContents />
              </ScrollView>
            </View>
            <Divider
              style={{ width: '100%', marginTop: responsiveScreenHeight(1) }}
              color="#EEEEEE"
              insetType="middle"
              width={1}
              orientation="horizontal"
            />
            <Text style={styles.titleText}>K-Drama</Text>
            <View style={{ height: responsiveScreenHeight(22) }}>
              <ScrollView
                nestedScrollEnabled={true}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.kdramaScrollViewContainer}
              >
                <View style={styles.kdramaScrollViewHider}>
                  <GetKdramaLearningContents />
                </View>
                <Text style={styles.comingSoon}>Coming Soon...</Text>
              </ScrollView>
            </View>
            <Divider
              style={{ width: '100%', marginTop: responsiveScreenHeight(1) }}
              color="#EEEEEE"
              insetType="middle"
              width={1}
              orientation="horizontal"
            />
            <Text style={styles.titleText}>K-Movie</Text>
            <View style={{ height: responsiveScreenHeight(22) }}>
              <ScrollView
                nestedScrollEnabled={true}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.kmovieScrollViewContainer}
              >
                <View style={styles.kmovieScrollViewHider}>
                  <GetKmovieLearningContents />
                </View>
                <Text style={styles.comingSoon}>Coming Soon...</Text>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
    marginBottom: responsiveScreenHeight(7),
  },
  mainText: {
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(3),
    marginLeft: responsiveScreenWidth(5),
    fontSize: responsiveFontSize(3),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#444444',
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
    color: '#555555',
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
    marginLeft: responsiveScreenWidth(10),
    backgroundColor: 'black',
  },
  titleText: {
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(2),
    marginLeft: responsiveScreenWidth(5),
    fontSize: responsiveFontSize(2.6),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#555555',
    // backgroundColor: 'black',
  },
});

export default LearningMain;

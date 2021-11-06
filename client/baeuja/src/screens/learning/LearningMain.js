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
  responsiveHeight,
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
        {/* <Divider
          style={{ width: '100%', marginTop: responsiveScreenHeight(1) }}
          color="#EEEEEE"
          insetType="middle"
          width={5}
          orientation="horizontal"
        /> */}
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={styles.kpopTextContainer}>
              <Text style={styles.titleText}>K-Pop</Text>
              <TouchableOpacity
                style={styles.moreText}
                onPress={() =>
                  navigate('Stack', {
                    screen: 'K-Pop',
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
            <View style={styles.kdramaTextContainer}>
              <Text style={styles.titleText}>K-Drama</Text>
              <TouchableOpacity
                style={styles.kmoviemoreText}
                onPress={() =>
                  navigate('Stack', {
                    screen: 'K-Drama',
                  })
                }
              >
                <Text style={{ color: '#666666', fontWeight: 'bold' }}>more</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: responsiveScreenHeight(32) }}>
              <ScrollView
                nestedScrollEnabled={true}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.kdramaScrollViewContainer}
              >
                <GetKdramaLearningContents />
              </ScrollView>
            </View>
            <Divider
              style={{ width: '100%', marginTop: responsiveScreenHeight(1) }}
              color="#EEEEEE"
              insetType="middle"
              width={1}
              orientation="horizontal"
            />
            <View style={styles.kmovieTextContainer}>
              <Text style={styles.titleText}>K-Movie</Text>
              <TouchableOpacity
                style={styles.kmoviemoreText}
                onPress={() =>
                  navigate('Stack', {
                    screen: 'K-Movie',
                  })
                }
              >
                <Text style={{ color: '#666666', fontWeight: 'bold' }}>more</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: responsiveScreenHeight(32) }}>
              <ScrollView
                nestedScrollEnabled={true}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.kmovieScrollViewContainer}
              >
                <GetKmovieLearningContents />
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
  kpopTextContainer: {
    width: responsiveScreenWidth(100),
    flexDirection: 'row',
  },
  kdramaTextContainer: {
    width: responsiveScreenWidth(100),
    flexDirection: 'row',
  },
  kmovieTextContainer: {
    width: responsiveScreenWidth(100),
    flexDirection: 'row',
  },
  moreText: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: responsiveScreenWidth(60),
  },
  kmoviemoreText: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginLeft: responsiveScreenWidth(55),
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

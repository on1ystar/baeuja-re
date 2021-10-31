/* eslint-disable react/prop-types */
// Library import
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Divider } from 'react-native-elements'; // Elements
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
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons
import { color } from 'react-native-elements/dist/helpers';

class GetUnits extends React.Component {
  state = {
    count: 0,
    isLoading: true,
    units: [],
  };

  componentDidMount() {
    this.getUnits();
    console.log('Component rendered');
  }

  getUnits = () => {
    const contentId = this.props.contentId;

    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: { success, units, tokenExpired, errorMessage },
        } = await axios(`https://dev.k-peach.io/learning/contents/${contentId}/units`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }

        if (!success) throw new Error(errorMessage);

        console.log('success getting units');
        this.setState({ isLoading: false, units });
      } catch (error) {
        console.log(error);
      }
    });
  };

  render() {
    const { units, isLoading } = this.state;
    const contentTitle = this.props.contentTitle;

    return (
      <View style={styles.allContainer}>
        <View style={styles.thumbNailContainer}>
          {isLoading ? (
            <Text> </Text>
          ) : (
            units.map((unit) => (
              <DrawingUnit key={unit.unitIndex} unit={unit} contentTitle={contentTitle} />
            ))
          )}
        </View>
      </View>
    );
  }
}

const DrawingUnit = ({ unit, contentTitle }) => {
  const navigation = useNavigation();
  const contentId = unit.contentId;
  const unitIndex = unit.unitIndex;

  let unitLearningCount;
  if (unit.counts == null) {
    unitLearningCount = 'Not learned';
  } else {
    unitLearningCount = unit.counts;
  }

  let latestLearningAt;
  if (unit.latestLearningAt == null) {
    latestLearningAt = 'Not learned yet';
  } else {
    latestLearningAt = unit.latestLearningAt.split('T');
    latestLearningAt = latestLearningAt[0];
  }

  return (
    <View style={styles.thumbNail}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Stack', {
            screen: 'LearningUnit',
            params: {
              contentId,
              unitIndex,
            },
          })
        }
      >
        {/* <ImageBackground
          source={{
            uri: unit.thumbnailUri,
          }}
          style={styles.thumbNail}
          imageStyle={{ borderRadius: 10 }}
        > */}
        {/* <ImageBackground
          source={require('../../assets/img/kpopunit.png')}
          style={styles.thumbNail}
          imageStyle={{ borderRadius: 10 }}
        > */}
        <Image
          transitionDuration={1000}
          source={require('../../assets/img/musicUnitThumbnail.jpg')}
          style={styles.thumbnailImage}
        />
        <View style={styles.unitDescriptionContainer}>
          <Text
            style={{
              fontSize: responsiveFontSize(1.9),
              width: responsiveScreenWidth(40),
              color: '#9388E8',
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {contentTitle}
          </Text>
          <Text style={styles.unitIndex}>Unit.{unit.unitIndex}</Text>
          <Divider
            style={{ width: '80%', marginTop: responsiveScreenHeight(1) }}
            color="#DDDDDD"
            insetType="middle"
            width={1}
            orientation="horizontal"
          />
          <View>
            <Text style={styles.unitDescription}>
              <Ionicons style={styles.schoolIcon} name="school"></Ionicons>
              {'  '}
              {unit.sentencesCounts} sentences{'\n'}
              <Ionicons style={styles.schoolIcon} name="school"></Ionicons>
              {'  '}
              {unit.wordsCounts} words
            </Text>
          </View>
          <View style={{ marginTop: responsiveScreenHeight(0.5) }}>
            <Text style={styles.unitLearningCount}>learning counts : {unitLearningCount}</Text>
            <Text style={styles.unitLatestLearningAt}>latest learned : {latestLearningAt}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default GetUnits;

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  thumbnailImage: {
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    width: responsiveScreenWidth(30),
    height: responsiveScreenHeight(18),
  },
  thumbNailContainer: {
    flex: 1,
    marginTop: responsiveScreenHeight(3),
    paddingBottom: responsiveScreenHeight(3),
    marginBottom: responsiveScreenHeight(3),
  },
  thumbNail: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: responsiveScreenHeight(3),
    width: responsiveScreenWidth(83),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  unitDescriptionContainer: {
    position: 'absolute',
    top: responsiveScreenWidth(0),
    left: responsiveScreenWidth(30),
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: responsiveScreenWidth(5),
  },
  unitIndex: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#9388E8',
    fontWeight: '900',
    marginTop: responsiveScreenHeight(1),
  },
  unitDescription: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#AAAAAA',
    fontWeight: '900',
    marginTop: responsiveScreenHeight(1),
  },
  schoolIcon: {
    fontSize: responsiveFontSize(1.7),
  },
  unitWords: {
    marginTop: responsiveScreenHeight(1.5),
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#43BAFF',
    fontWeight: '900',
  },
  unitLearningCount: {
    paddingTop: responsiveScreenHeight(0.5),
    color: '#AAAAAA',
    fontSize: responsiveFontSize(1.2),
    fontFamily: 'NanumSquareOTFB',
  },
  unitLatestLearningAt: {
    color: '#AAAAAA',
    fontSize: responsiveFontSize(1.2),
    fontFamily: 'NanumSquareOTFB',
  },
});

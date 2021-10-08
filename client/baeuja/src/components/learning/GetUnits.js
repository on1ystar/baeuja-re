/* eslint-disable react/prop-types */
// Library import
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native';
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
        } = await axios(`https://api.k-peach.io/learning/contents/${contentId}/units`, {
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
    return (
      <View>
        {isLoading ? (
          <Text> </Text>
        ) : (
          units.map((unit) => <DrawingUnit key={unit.unitIndex} unit={unit} />)
        )}
      </View>
    );
  }
}

const DrawingUnit = ({ unit }) => {
  const navigation = useNavigation();
  const contentId = unit.contentId;
  const unitIndex = unit.unitIndex;

  return (
    <View>
      <TouchableOpacity
        style={styles.thumbNailContainer}
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
        <ImageBackground
          source={{
            uri: unit.thumbnailUri,
          }}
          style={styles.thumbNail}
          imageStyle={{ borderRadius: 10 }}
        >
          <View style={styles.thumaNailHider}></View>
          <View style={styles.unitDescriptionContainer}>
            <Text style={styles.unitDescription}>Unit.{unit.unitIndex}</Text>
            <View>
              <Text style={styles.unitDescription}>
                <Ionicons style={styles.schoolIcon} name="school"></Ionicons>
                {'  '}
                {unit.sentencesCounts} Sentences, {unit.wordsCounts} Words
              </Text>
            </View>
            <Text style={styles.unitWords}>
              #{unit.words[0].originalKoreanText} #{unit.words[1].originalKoreanText}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default GetUnits;

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
  },
  thumbNailContainer: {
    marginTop: 30,
  },
  thumbNail: {
    width: 340,
    height: 150,
  },
  thumaNailHider: {
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
    opacity: 0.1,
    borderRadius: 10,
  },
  unitDescriptionContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  unitDescription: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontWeight: '900',
    marginTop: 3,
  },
  schoolIcon: {
    fontSize: responsiveFontSize(2.2),
  },
  unitWords: {
    marginTop: 6,
    fontSize: responsiveFontSize(1.9),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#43baff',
    fontWeight: '900',
  },
});

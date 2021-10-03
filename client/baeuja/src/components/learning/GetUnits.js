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
          onPress={() => console.log('onPress()')}
          source={{
            uri: unit.thumbnailUri,
          }}
          style={styles.thumbNail}
          imageStyle={{ borderRadius: 10 }}
        >
          <View style={styles.thumaNailHider}></View>
          <View style={styles.unitDescriptionContainer}>
            <Text style={styles.unitDescription}>Unit.{unit.unitIndex}</Text>
            <Text style={styles.unitDescription}>
              {unit.sentencesCounts} Sentences, {unit.wordsCounts} Words
            </Text>
            <Text style={styles.unitDescription}>
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
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  unitDescription: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontWeight: '900',
  },
});

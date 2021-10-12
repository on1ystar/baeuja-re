/* eslint-disable react/prop-types */
// Library import
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage

class GetLearningContents extends React.Component {
  state = {
    count: 0,
    isLoading: true,
    contents: [],
  };
  componentDidMount() {
    this.getContents();
    console.log('Component rendered');
  }

  getContents = () => {
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: { success, contents, tokenExpired, errorMessage },
        } = await axios('https://api.k-peach.io/learning/contents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }

        if (!success) throw new Error(errorMessage);

        console.log('success getting contents');
        this.setState({ isLoading: false, contents });
      } catch (error) {
        console.log(error);
      }
    });
  };

  render() {
    const { contents, isLoading } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {isLoading ? (
          <Text> </Text>
        ) : (
          contents.map((content) => <DrawingContent key={content.contentId} content={content} />)
        )}
      </View>
    );
  }
}

const DrawingContent = ({ content }) => {
  const navigation = useNavigation();
  const contentId = content.contentId;
  return (
    <View style={styles.allContainer}>
      <View style={styles.kpopContainer}>
        <Image
          transitionDuration={1000}
          source={{
            uri: content.thumbnailUri,
          }}
          style={styles.thumbnailImage}
        />
        <View style={styles.titleContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Stack', {
                screen: 'LearningUnits',
                params: {
                  contentId,
                },
              })
            }
          >
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {content.title}
            </Text>
            <Text style={styles.artist}>{content.artist}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            return navigation.navigate('Stack', {
              screen: 'MoreInfo',
              params: {
                contentId,
              },
            });
          }}
          style={styles.infoIconContainer}
        >
          <Ionicons style={styles.infoIcon} name="information-circle-outline"></Ionicons>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
  },
  kpopContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 16,
    marginLeft: 22,
    width: responsiveScreenWidth(100),
    // backgroundColor: '#000000',
  },
  thumbnailImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  titleContainer: {
    marginLeft: 24,
  },
  title: {
    width: responsiveScreenWidth(50),
    marginTop: 12,
    fontSize: responsiveFontSize(2.1),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  artist: {
    marginTop: 10,
    fontSize: responsiveFontSize(1.9),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#999999',
  },
  infoIconContainer: {
    marginLeft: 15,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    // backgroundColor: '#000000',
  },
  infoIcon: {
    color: '#aaaaaa',
    fontSize: responsiveFontSize(3),
  },
});

export default GetLearningContents;

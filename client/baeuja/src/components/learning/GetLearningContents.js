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
      <View>
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
    <View>
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
                screen: 'Units',
                params: {
                  contentId,
                },
              })
            }
          >
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.artist}>{content.artist}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoIconContainer}>
          <Ionicons style={styles.infoIcon} name="information-circle-outline"></Ionicons>
        </View>
      </View>
    </View>
  );
};

export default GetLearningContents;

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
    width: 84,
    height: 84,
    borderRadius: 10,
  },
  titleContainer: {
    marginLeft: 24,
  },
  title: {
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
    justifyContent: 'flex-end',
    alignSelf: 'center',
    // backgroundColor: '#000000',
  },
  infoIcon: {
    fontSize: responsiveFontSize(2),
  },
});

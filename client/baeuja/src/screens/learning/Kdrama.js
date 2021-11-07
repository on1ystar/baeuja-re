/* eslint-disable react/prop-types */
// Library import
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
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
import { ProgressBar } from '@react-native-community/progress-bar-android'; // RN Progress bar android

class Kdrama extends React.Component {
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
      <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {isLoading ? (
          <Text> </Text>
        ) : (
          contents.map((content) => {
            if (content.classification === 'K-DRAMA') {
              return <DrawingContent key={content.contentId} content={content} />;
            }
          })
        )}
      </ScrollView>
    );
  }
}

const DrawingContent = ({ content }) => {
  const navigation = useNavigation();
  const contentId = content.contentId;
  const contentTitle = content.title;

  return (
    <SafeAreaView style={styles.allContainer}>
      <View style={styles.kpopContainer}>
        {/* <Image
          transitionDuration={1000}
          source={{
            uri: content.thumbnailUri,
          }}
          style={styles.thumbnailImage}
        /> */}
        <Image
          transitionDuration={1000}
          source={require('../../assets/img/moviePoster.jpg')}
          style={styles.thumbnailImage}
        />
        <View style={styles.titleContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Stack', {
                screen: 'Units',
                params: {
                  contentId,
                  contentTitle,
                },
              })
            }
          >
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {content.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1} ellipsizeMode="tail">
              {content.director}
            </Text>
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <Text
              style={{
                color: '#000000',
                fontSize: responsiveScreenFontSize(1.3),
              }}
            >
              Progress
            </Text>
            <ProgressBar
              style={{
                position: 'absolute',
                top: responsiveScreenHeight(1.5),
                width: responsiveScreenWidth(40),
              }}
              styleAttr="Horizontal"
              indeterminate={false}
              color={'#9388E8'}
              progress={content.progressRate * 0.01}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            return navigation.navigate('Stack', {
              screen: 'Song Info',
              params: {
                contentId,
                contentTitle,
              },
            });
          }}
          style={styles.infoIconContainer}
        >
          <Ionicons style={styles.infoIcon} name="information-circle-outline"></Ionicons>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
    marginBottom: responsiveScreenHeight(2),
  },
  kpopContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: responsiveScreenHeight(2),
    marginLeft: responsiveScreenWidth(5),
    width: responsiveScreenWidth(100),
  },
  thumbnailImage: {
    width: responsiveScreenWidth(23),
    height: responsiveScreenWidth(30),
    borderRadius: 10,
  },
  titleContainer: {
    marginLeft: responsiveScreenWidth(5),
    height: responsiveHeight(8),
  },
  title: {
    color: '#444444',
    width: responsiveScreenWidth(50),
    marginTop: responsiveScreenHeight(1),
    fontSize: responsiveFontSize(2.1),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  artist: {
    width: responsiveScreenWidth(50),
    marginBottom: responsiveScreenHeight(1),
    marginTop: responsiveScreenHeight(0.5),
    fontSize: responsiveFontSize(1.7),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '600',
    color: '#666666',
  },
  infoIconContainer: {
    marginLeft: responsiveScreenWidth(5),
    justifyContent: 'flex-end',
    alignSelf: 'center',
    // backgroundColor: '#000000',
  },
  infoIcon: {
    color: '#aaaaaa',
    fontSize: responsiveFontSize(3),
  },
  progressContainer: {
    marginTop: responsiveScreenHeight(3),
  },
});

export default Kdrama;

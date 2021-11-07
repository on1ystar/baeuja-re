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
import { ProgressBar } from '@react-native-community/progress-bar-android'; // RN Progress bar android

class GetKdramaLearningContents extends React.Component {
  state = {
    count: 0,
    isLoading: true,
    contents: [],
  };

  ComponentDidMount;
  componentDidMount() {
    this.getContents();
    console.log('Component rendered');
  }

  // 컨텐츠 가져오기
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

        console.log('success getting K-Drama Contents');
        this.setState({ isLoading: false, contents });
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 리턴 (렌더링)
  render() {
    const { contents, isLoading } = this.state;
    return (
      <View style={styles.kdramaAllContainer}>
        {isLoading ? (
          <Text> </Text>
        ) : (
          contents.map((content) => {
            if (content.classification === 'K-DRAMA') {
              return <DrawingContent key={content.contentId} content={content} />;
            }
          })
        )}
        {/*  하드코딩 데이터 */}
        {/* <View style={styles.kdramaContainer}>
          <Image
            transitionDuration={1000}
            source={require('../../assets/img/moviePoster.jpg')}
            style={styles.thumbnailImage}
          />
          <View style={styles.kdramaTitleContainer}>
            <Text style={styles.kdramaTitle} numberOfLines={1} ellipsizeMode="tail">
              SQUID GAME
            </Text>
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
              disabled={true}
            >
              <Ionicons style={styles.infoIcon} name="ellipsis-vertical"></Ionicons>
            </TouchableOpacity>
          </View>
        </View> */}
      </View>
    );
  }
}

// 컨텐츠 그리기
const DrawingContent = ({ content }) => {
  const navigation = useNavigation();
  const contentId = content.contentId;
  const contentTitle = content.title;

  return (
    <View>
      <View style={styles.kdramaContainer}>
        <View style={styles.kdramaTitleContainer}>
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
            <Image
              transitionDuration={1000}
              source={require('../../assets/img/moviePoster.jpg')}
              style={styles.thumbnailImage}
            />
            <Text style={styles.kdramaTitle} numberOfLines={1} ellipsizeMode="tail">
              {content.title}
            </Text>
            <Text style={styles.kdramaDirector} numberOfLines={1} ellipsizeMode="tail">
              {content.director}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: 'absolute',
            top: responsiveScreenHeight(25),
            right: 0,
            height: responsiveScreenHeight(2.75),
            width: responsiveScreenWidth(5.5),
            zIndex: 1,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              return navigation.navigate('Stack', {
                screen: 'Drama Info',
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
              width: responsiveScreenWidth(33),
            }}
            styleAttr="Horizontal"
            indeterminate={false}
            color={'#9388E8'}
            progress={content.progressRate * 0.01}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
  },
  kdramaAllContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: responsiveScreenWidth(5),
    marginTop: responsiveScreenHeight(1.5),
  },
  kdramaContainer: {
    marginRight: responsiveScreenWidth(5),
  },
  kdramaTitleContainer: {
    width: responsiveScreenWidth(23),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(1),
  },
  kdramaTitle: {
    color: '#666666',
    width: responsiveScreenWidth(30),
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  kdramaDirector: {
    color: '#666666',
    width: responsiveScreenWidth(30),
    fontSize: responsiveScreenFontSize(1.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  kdramaProgress: {
    color: '#666666',
    fontSize: responsiveScreenFontSize(1.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  thumbnailImage: {
    width: responsiveScreenWidth(33),
    height: responsiveScreenHeight(20),
    borderRadius: 10,
  },
  infoIconContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'center',
    // backgroundColor: '#000000',
  },
  infoIcon: {
    color: '#aaaaaa',
    fontSize: responsiveFontSize(3),
  },
  progressContainer: {},
});

export default GetKdramaLearningContents;

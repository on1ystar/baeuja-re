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

class GetKmovieLearningContents extends React.Component {
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

        console.log('success getting contents');
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
      <View style={styles.kmovieAllContainer}>
        {isLoading ? (
          <Text> </Text>
        ) : (
          contents.map((content) => {
            if (content.classification === 'K-MOVIE') {
              return <DrawingContent key={content.contentId} content={content} />;
            }
          })
        )}
        {/* <View style={styles.kdramaContainer}>
          <Image
            transitionDuration={1000}
            source={require('../../assets/img/moviePoster.jpg')}
            style={styles.thumbnailImage}
          />
          <View style={styles.kdramaTitleContainer}>
            <Text style={styles.kdramaTitle} numberOfLines={1} ellipsizeMode="tail">
              MINARI
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
          <View>
            <Text style={styles.kdramaProgress}>Progress : ∙ ∙ ∙ ∙ ∙ </Text>
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
      <View style={styles.kmovieContainer}>
        <View style={styles.kmovieTitleContainer}>
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
              source={require('../../assets/img/movieUnitThumbnail2.png')}
              style={styles.thumbnailImage}
            />
            <Text style={styles.kmovieTitle} numberOfLines={1} ellipsizeMode="tail">
              {content.title}
            </Text>
            <Text style={styles.kmovieDirector} numberOfLines={1} ellipsizeMode="tail">
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
                screen: 'Movie Info',
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
  kmovieAllContainer: {
    flexDirection: 'row',
    marginLeft: responsiveScreenWidth(5),
    marginTop: responsiveScreenHeight(1),
  },
  kmovieContainer: {
    marginRight: responsiveScreenWidth(5),
  },
  kmovieTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(1),
  },
  kmovieTitle: {
    color: '#666666',
    width: responsiveScreenWidth(30),
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  kmovieDirector: {
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
    color: '#666666',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    // backgroundColor: '#000000',
  },
  infoIcon: {
    color: '#aaaaaa',
    fontSize: responsiveFontSize(3),
  },
});

export default GetKmovieLearningContents;

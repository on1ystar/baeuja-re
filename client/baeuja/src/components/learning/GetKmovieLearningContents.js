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

class GetKmovieLearningContents extends React.Component {
  state = {
    count: 0,
    isLoading: true,
    contents: [],
  };

  // ComponentDidMount
  //   componentDidMount() {
  //     this.getContents();
  //     console.log('Component rendered');
  //   }

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
        } = await axios('https://dev.k-peach.io/learning/contents', {
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
      <View style={styles.kdramaAllContainer}>
        {/* 실제 드라마 데이터 있을경우 바꾸기
        {isLoading ? (
          <Text> </Text>
        ) : (
          contents.map((content) => <DrawingContent key={content.contentId} content={content} />)
        )} */}
        <View style={styles.kdramaContainer}>
          <Image
            transitionDuration={1000}
            source={require('../../assets/img/kmovie.png')}
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
        </View>
        <View style={styles.kdramaContainer}>
          <Image
            transitionDuration={1000}
            source={require('../../assets/img/kmovie.png')}
            style={styles.thumbnailImage}
          />
          <View style={styles.kdramaTitleContainer}>
            <Text style={styles.kdramaTitle} numberOfLines={1} ellipsizeMode="tail">
              PARASITE
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
        </View>
        <View style={styles.kdramaContainer}>
          <Image
            transitionDuration={1000}
            source={require('../../assets/img/kmovie.png')}
            style={styles.thumbnailImage}
          />
          <View style={styles.kdramaTitleContainer}>
            <Text style={styles.kdramaTitle} numberOfLines={1} ellipsizeMode="tail">
              Spaceship Victory
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
        </View>
      </View>
    );
  }
}

// 컨텐츠 그리기
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
          <Ionicons style={styles.infoIcon} name="ellipsis-vertical"></Ionicons>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
  },
  kdramaAllContainer: {
    flexDirection: 'row',
    marginLeft: responsiveScreenWidth(5),
    marginTop: responsiveScreenHeight(1.5),
  },
  kdramaContainer: {
    marginRight: responsiveScreenWidth(5),
  },
  kdramaTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(1),
  },
  kdramaTitle: {
    color: '#666666',
    width: responsiveScreenWidth(23),
    fontSize: responsiveScreenFontSize(2),
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
    width: responsiveScreenWidth(26),
    height: responsiveScreenHeight(13),
    borderRadius: 10,
  },
  infoIconContainer: {
    color: '#666666',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    // backgroundColor: '#000000',
  },
});

export default GetKmovieLearningContents;

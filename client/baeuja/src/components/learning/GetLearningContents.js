/* eslint-disable react/prop-types */
// Library import
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
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

const GetLearningContents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState([]);

  // Contents Data 가져오기
  const getContents = () => {
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

        setContents(contents);
        setIsLoading(false);
        console.log('success getting contents');
      } catch (error) {
        console.log(error);
      }
    });
  };

  // useEffect
  useEffect(getContents, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {isLoading ? (
        <Text> </Text>
      ) : (
        contents.map((content) => <DrawingContent key={content.contentId} content={content} />)
      )}
    </View>
  );
};

const DrawingContent = ({ content }) => {
  const navigation = useNavigation();
  const contentId = content.contentId;
  return (
    <View style={styles.allContainer}>
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
          source={require('../../assets/img/kpop.png')}
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
    marginTop: responsiveScreenHeight(2),
    marginLeft: responsiveScreenWidth(5),
    width: responsiveScreenWidth(100),
    // backgroundColor: '#000000',
  },
  thumbnailImage: {
    width: responsiveScreenWidth(15),
    height: responsiveScreenWidth(15),
    borderRadius: 10,
  },
  titleContainer: {
    marginLeft: responsiveScreenWidth(5),
  },
  title: {
    color: '#444444',
    width: responsiveScreenWidth(50),
    fontSize: responsiveFontSize(2.1),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  artist: {
    fontSize: responsiveFontSize(1.9),
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
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default GetLearningContents;

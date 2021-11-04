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
import { Divider } from 'react-native-elements'; // Elements
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage

// 새로운 콘텐츠 가져오기
const GetNewContents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [newContents, SetNewContents] = useState([]);

  const loadNewContents = () => {
    console.log(`Load New Contents ...`);

    // New Contents 데이터 조회
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: { success, contents, tokenExpired, errorMessage },
        } = await axios.get(`https://dev.k-peach.io/home/contents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\ncontents: ${contents}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting New Contents');

        SetNewContents(contents);
        setIsLoading(() => false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(loadNewContents, []);

  // GetNewContents return 부분
  return (
    <ScrollView
      style={{ height: responsiveScreenHeight(30) }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {isLoading ? (
        <Text style={{ marginLeft: responsiveScreenWidth(5), color: '#444444' }}>
          {' '}
          Loading... Please wait...{' '}
        </Text>
      ) : (
        newContents.map((newcontents) => (
          <DrawNewContents key={newcontents.contentId} newcontents={newcontents} />
        ))
      )}
    </ScrollView>
  );
};

// 새로운 콘텐츠 그리기
const DrawNewContents = ({ newcontents }) => {
  const navigation = useNavigation();
  const contentId = newcontents.contentId;
  const contentTitle = newcontents.title;

  return (
    <View style={styles.newContentsContainer}>
      <View style={styles.kdramaContainer}>
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
          {/* <Image
            transitionDuration={1000}
            source={{
              uri: newcontents.thumbnailUri,
            }}
            style={styles.thumbnailImage}
          /> */}
          <Image
            transitionDuration={1000}
            source={require('../../assets/img/albumJacketBig.jpg')}
            style={styles.thumbnailImage}
          />
          <View style={styles.kdramaTitleContainer}>
            <Text style={styles.kdramaTitle} numberOfLines={1} ellipsizeMode="tail">
              {newcontents.artist} - {newcontents.title}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.newContentsInfo}>{newcontents.countsOfUnits} Units | </Text>
            <Text style={styles.newContentsInfo}>{newcontents.countsOfWords} Words</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newContentsContainer: {
    marginTop: responsiveScreenHeight(2),
    marginLeft: responsiveScreenWidth(5),
    flexDirection: 'row',
  },
  kdramaContainer: {
    marginRight: 20,
  },
  kdramaTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  kdramaTitle: {
    color: '#000000',
    width: responsiveScreenWidth(35),
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '600',
  },
  newContentsInfo: {
    fontSize: responsiveScreenFontSize(1.4),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '600',
    color: '#9388E8',
    marginTop: responsiveScreenHeight(0.5),
  },
  thumbnailImage: {
    width: responsiveScreenWidth(36),
    height: responsiveScreenHeight(18),
    borderRadius: 10,
  },
  infoIconContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'center',
    // backgroundColor: '#000000',
  },
});

export default GetNewContents;

// Library import
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'; // React Native elements
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
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
import Antdesign from 'react-native-vector-icons/AntDesign'; // AntDesign
import { Card, Divider } from 'react-native-elements'; // React Native Elements
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import { Picker } from '@react-native-picker/picker'; // React Native Picker

// Component import
import GetBookmarkedWords from '../../components/bookmark/GetBookmarkedWords';
import GetBookmarkedSentences from '../../components/bookmark/GetBookmarkedSentences';

const Bookmark = () => {
  const [selector, setSelector] = useState(false);
  const [sortBy, setSortBy] = useState('bookmark_at'); // bookmark_at(default) | latest_learning_at
  const [option, setOption] = useState('DESC'); // DESC(default)  | ASC
  const navigation = useNavigation();

  //Bookmark Screen Return
  return (
    <View style={styles.allContainer}>
      {
        <View style={styles.allContainer}>
          <Text style={styles.bookmarkTitle}>Bookmark</Text>
          <Divider
            style={{ width: '100%', marginTop: responsiveScreenHeight(1) }}
            color="#EEEEEE"
            insetType="middle"
            width={1}
            orientation="horizontal"
          />
          <View style={styles.selectButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                setSelector(true);
                console.log(selector);
              }}
            >
              <View style={selector ? styles.wordsButtonSelected : styles.wordsButtonNotSelected}>
                <Text style={selector ? styles.wordsTextSelected : styles.wordsTextNotSelected}>
                  Words
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelector(false);
                console.log(selector);
              }}
            >
              <View
                style={
                  selector ? styles.sentencesButtonNotSelected : styles.sentencesButtonSelected
                }
              >
                <Text
                  style={selector ? styles.sentencesTextNotSelected : styles.sentencesTextSelected}
                >
                  Sentences
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: responsiveScreenHeight(2),
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* 정렬 기능 (Sortby) */}
            {/* <TouchableOpacity
              onPress={() =>
                navigation.navigate('Stack', {
                  screen: 'Sort Options',
                  params: {
                    sortBy,
                  },
                })
              }
            > */}
            {/* <View
              style={{
                backgroundColor: '#EFEFEF',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                width: responsiveScreenWidth(10),
                height: responsiveScreenWidth(10),
              }}
            >
              <Ionicons color={'#000000'} size={30} name="options"></Ionicons>
            </View> */}
            <View
              style={{
                borderColor: '#000000',
                color: '#000000',
                paddingBottom: 0,
                paddingTop: 0,
                paddingRight: 0,
                paddingLeft: 0,
                borderRadius: 10,
                height: responsiveScreenHeight(6.5),
                width: responsiveScreenWidth(40),
                marginRight: responsiveScreenWidth(5),
              }}
            >
              <Picker
                style={{
                  backgroundColor: '#FBFBFB',
                  borderColor: '#000000',
                  color: '#000000',
                  height: responsiveScreenHeight(5),
                  width: responsiveScreenWidth(40),
                  paddingBottom: 0,
                  paddingTop: 0,
                  borderWidth: 1,
                }}
                selectedValue={sortBy}
                onValueChange={(itemValue, itemIndex) => setSortBy(itemValue)}
              >
                <Picker.Item
                  style={{ fontSize: responsiveFontSize(1.5) }}
                  label={'bookmark at'}
                  value={'bookmark_at'}
                  key={'bookmark_at'}
                />
                <Picker.Item
                  style={{ fontSize: responsiveFontSize(1.5) }}
                  label={'latest learning at'}
                  value={'latest_learning_at'}
                  key={'latest_learning_at'}
                />
              </Picker>
            </View>
            {/* </TouchableOpacity> */}

            {/* 정렬 기능 (Option) */}
            {/* <TouchableOpacity> */}
            {/* <View
              style={{
                backgroundColor: '#F3F3F3',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                width: responsiveScreenWidth(10),
                height: responsiveScreenWidth(10),
                marginLeft: responsiveScreenWidth(2),
              }}
            >
              <Ionicons
                color={'#000000'}
                size={25}
                name={option === 'DESC' ? 'arrow-down-outline' : 'arrow-up-outline'}
              ></Ionicons>
            </View> */}
            {/* </TouchableOpacity> */}
            <View
              style={{
                borderColor: '#000000',
                color: '#000000',
                paddingBottom: 0,
                paddingTop: 0,
                paddingRight: 0,
                paddingLeft: 0,
                borderRadius: 10,
                height: responsiveScreenHeight(6.5),
                width: responsiveScreenWidth(40),
              }}
            >
              <Picker
                style={{
                  backgroundColor: '#FBFBFB',
                  borderColor: '#000000',
                  color: '#000000',
                  height: responsiveScreenHeight(5),
                  width: responsiveScreenWidth(40),
                  paddingBottom: 0,
                  paddingTop: 0,
                  borderWidth: 1,
                }}
                selectedValue={option}
                onValueChange={(itemValue, itemIndex) => setOption(itemValue)}
              >
                <Picker.Item
                  style={{ fontSize: responsiveFontSize(1.5) }}
                  label={'Descending'}
                  value={'DESC'}
                  key={'DESC'}
                />
                <Picker.Item
                  style={{ fontSize: responsiveFontSize(1.5) }}
                  label={'Ascending'}
                  value={'ASC'}
                  key={'ASC'}
                />
              </Picker>
            </View>
          </View>
          {/* 정렬 기능 구현시 사용 */}
          {/* <View style={styles.timeContainer}>
            <Ionicons color={'#000000'} size={25} name="time-outline"></Ionicons>
            <Text style={styles.timeText}>2021. 10.</Text>
          </View> */}
          <ScrollView>
            {selector ? (
              <GetBookmarkedWords sortBy={sortBy} option={option} />
            ) : (
              <GetBookmarkedSentences sortBy={sortBy} option={option} />
            )}
          </ScrollView>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
  },
  bookmarkTitle: {
    marginTop: responsiveScreenHeight(2),
    marginLeft: responsiveScreenWidth(5),
    fontSize: responsiveScreenFontSize(3.5),
    // fontFamily: 'NanumSquareOTFB',
    // fontWeight: 'bold',
    fontFamily: 'Playball-Regular',

    color: '#444444',
  },
  selectButtonContainer: {
    flexDirection: 'row',
    marginTop: responsiveScreenHeight(3),
    width: responsiveScreenWidth(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordsButtonSelected: {
    backgroundColor: '#9388E8',
    width: responsiveScreenWidth(30),
    height: responsiveScreenHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginRight: responsiveScreenWidth(5),
    marginLeft: responsiveScreenWidth(2),
  },
  wordsButtonNotSelected: {
    backgroundColor: '#EDEDED',
    width: responsiveScreenWidth(30),
    height: responsiveScreenHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginRight: responsiveScreenWidth(5),
    marginLeft: responsiveScreenWidth(2),
  },
  wordsTextSelected: {
    fontSize: responsiveScreenFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wordsTextNotSelected: {
    fontSize: responsiveScreenFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#AAAAAA',
  },
  sentencesTextSelected: {
    fontSize: responsiveScreenFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sentencesTextNotSelected: {
    fontSize: responsiveScreenFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#AAAAAA',
  },
  sentencesButtonSelected: {
    backgroundColor: '#9388E8',
    width: responsiveScreenWidth(30),
    height: responsiveScreenHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginRight: responsiveScreenWidth(5),
    marginLeft: responsiveScreenWidth(2),
  },
  sentencesButtonNotSelected: {
    backgroundColor: '#EDEDED',
    width: responsiveScreenWidth(30),
    height: responsiveScreenHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginRight: responsiveScreenWidth(5),
    marginLeft: responsiveScreenWidth(2),
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveScreenHeight(5),
    marginLeft: responsiveScreenWidth(5),
  },
  timeText: {
    color: '#000000',
    marginLeft: responsiveScreenWidth(2),
    fontSize: responsiveFontSize(2.2),
  },
});

export default Bookmark;

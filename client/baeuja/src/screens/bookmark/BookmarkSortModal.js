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

const BookmarkSortModal = ({
  route: {
    params: { sortBy },
  },
}) => {
  const navigation = useNavigation();

  return (
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
        width: responsiveScreenWidth(42),
      }}
    >
      <Picker
        style={{
          backgroundColor: '#FBFBFB',
          borderColor: '#000000',
          color: '#000000',
          height: responsiveScreenHeight(5),
          width: responsiveScreenWidth(50),
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
  );
};

export default BookmarkSortModal;

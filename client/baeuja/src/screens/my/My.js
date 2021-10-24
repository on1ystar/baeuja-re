/* eslint-disable react/prop-types */

// Library import
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, Button, View, Alert, Text, TouchableOpacity, ScrollView } from 'react-native'; // React Native Component
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe'; // Youtube Player
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
import axios from 'axios'; // axios
import Sound from 'react-native-sound'; // React Native Sound (성우 음성 재생)
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player'; // React Native Audio Recorder Player (사용자 음성 녹음 및 재생)
import DocumentPicker from 'react-native-document-picker'; // Document Picker (파일 업로드)
import Icon from 'react-native-vector-icons/AntDesign'; // AntDesign
import Icon2 from 'react-native-vector-icons/Feather'; // Feather
import Icon3 from 'react-native-vector-icons/MaterialIcons'; // MaterialIcons
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage
import RNFS from 'react-native-fs';
import { useFocusEffect, useIsFocused } from '@react-navigation/native'; // Navigation
import { Card } from 'react-native-elements'; // React Native Elements
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons
import { Divider } from 'react-native-elements'; // Elements
import { useNavigation } from '@react-navigation/native'; // Navigation

const My = ({ navigation: { navigate } }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>My Page</Text>
      <Divider
        style={{ width: '100%', marginTop: responsiveScreenHeight(1) }}
        color="#EEEEEE"
        insetType="middle"
        width={1}
        orientation="horizontal"
      />
      <View style={{ flex: 1, marginTop: responsiveScreenHeight(2) }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Stack', {
              screen: 'Qna',
            })
          }
        >
          <View style={styles.qnaTextContainer}>
            <Text style={styles.titleText}>Q&A</Text>
            <Ionicons
              style={{ marginLeft: responsiveScreenWidth(5) }}
              size={30}
              color={'#444444'}
              name="chevron-forward-outline"
            ></Ionicons>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <TouchableOpacity>
          <View style={styles.qnaTextContainer}>
            <Text style={styles.titleText}>Change Nickname</Text>
            <Ionicons
              style={{ marginLeft: responsiveScreenWidth(5) }}
              size={30}
              color={'#444444'}
              name="chevron-forward-outline"
            ></Ionicons>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.qnaTextContainer}>
          <TouchableOpacity>
            <Text style={styles.titleText}>Test</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.qnaTextContainer}>
          <TouchableOpacity>
            <Text style={styles.titleText}>Test</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default My;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainText: {
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(5),
    marginLeft: responsiveScreenWidth(5),
    fontSize: responsiveFontSize(3.2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#444444',
    // backgroundColor: 'black',
  },
  qnaTextContainer: {
    width: responsiveScreenWidth(100),
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleText: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: responsiveScreenWidth(5),
    fontSize: responsiveFontSize(2.8),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    color: '#555555',
    // backgroundColor: 'black',
  },
});

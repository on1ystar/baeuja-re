/* eslint-disable react/prop-types */

// Library import
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import {
  StyleSheet,
  Button,
  View,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native'; // React Native Component
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
import {
  useNavigation,
  useFocusEffect,
  useIsFocused,
  CommonActions,
} from '@react-navigation/native'; // Navigation
import { Card } from 'react-native-elements'; // React Native Elements
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons
import { Divider } from 'react-native-elements'; // Elements

const qnaInput = ({
  route: {
    params: { qnaTypeId },
  },
}) => {
  const [qnaTitle, setQnaTitle] = useState('');
  const [qnaContent, setQnaContent] = useState('');
  const navigation = useNavigation();

  let qnaData;

  // QNA 보내기 함수
  const postQna = () => {
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }

        // AsyncStorage error
        if (error) throw error;

        if (Platform.OS === 'android') {
          qnaData = {
            qna: {
              title: qnaTitle,
              content: qnaContent,
              qnaTypeId: qnaTypeId,
            },
          };
        }

        await axios
          .post(`https://api.k-peach.io/qnas`, qnaData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(({ data: { success, qna, errorMessage } }) => {
            console.log(`success: ${success} | qna: ${qna}`);

            if (!success) throw new Error(errorMessage);

            console.log('success Post QNA');
            navigation.dispatch(
              CommonActions.navigate('Tabs', {
                screen: 'My',
              })
            );
          });
        //   if (tokenExpired) {
        //     // login으로 redirect
        //   }
      } catch (error) {
        console.log(error);
      }
    });
  };

  // QNA Input 전체 Return
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.qnaTitleInput}
        placeholder="Please enter title..."
        placeholderTextColor="#444444"
        value={qnaTitle}
        onChangeText={(text) => setQnaTitle(text)}
      ></TextInput>
      <TextInput
        style={styles.qnaContentInput}
        placeholder="Please enter your Q&A..."
        placeholderTextColor="#444444"
        value={qnaContent}
        onChangeText={(text) => setQnaContent(text)}
        multiline={true}
        numberOfLines={19}
      ></TextInput>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          postQna();
        }}
      >
        <View style={styles.qnaSendBtn}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: responsiveFontSize(2.2),
              fontFamily: 'NanumSquareOTFB',
              fontWeight: 'bold',
            }}
          >
            Send
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default qnaInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  qnaTitleInput: {
    marginTop: responsiveScreenHeight(10),
    fontSize: responsiveFontSize(2),
    color: '#000000',
    height: responsiveScreenHeight(5),
    width: responsiveScreenWidth(80),
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 10,
    paddingLeft: responsiveScreenWidth(5),
  },
  qnaContentInput: {
    marginTop: responsiveScreenHeight(5),
    color: '#000000',
    fontSize: responsiveFontSize(2),
    height: responsiveScreenHeight(50),
    width: responsiveScreenWidth(80),
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 20,
    paddingLeft: responsiveScreenWidth(5),
  },
  qnaSendBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9388E8',
    borderRadius: responsiveScreenWidth(2),
    width: responsiveScreenWidth(30),
    height: responsiveScreenHeight(5),
    marginTop: responsiveScreenHeight(5),
  },
  sendQnaContainer: {
    marginBottom: responsiveScreenHeight(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewQnaContainer: {
    marginBottom: responsiveScreenHeight(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchQnaContainer: {
    marginBottom: responsiveScreenHeight(5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteQnaContainer: { flexDirection: 'row', alignItems: 'center' },
  sendQnaTitle: {
    color: '#444444',
    fontSize: responsiveFontSize(3.2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  viewQnaTitle: {
    color: '#444444',
    fontSize: responsiveFontSize(3.2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  searchQnaTitle: {
    color: '#444444',
    fontSize: responsiveFontSize(3.2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  deleteQnaTitle: {
    color: '#444444',
    fontSize: responsiveFontSize(3.2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
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

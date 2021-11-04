// Library import
import React, { useState, useCallback, useRef, Component, useEffect } from 'react'; // React Hooks
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'; // React Native elements
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
import { Card } from 'react-native-elements'; // React Native Elements
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage

// Q&A 화면 전체 그리는 함수
const ContactUs = () => {
  const [qnaTypes, setQnaTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [randomNumber, setRandomNumber] = useState(Math.random());

  // Q&A Types 불러오기
  const loadQnaTypes = () => {
    // Q&A Type 가져오기
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: { success, qnaTypes, tokenExpired, errorMessage },
        } = await axios.get(`https://api.k-peach.io/qnas/types`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\n Q&A Types: ${qnaTypes}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting Q&A Types');

        setQnaTypes(qnaTypes);
        setIsLoading(() => false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // useEffect
  useEffect(loadQnaTypes, []);

  // send Qna Screen 전체 렌더링
  return (
    <View style={styles.allContainer}>
      {isLoading ? (
        <Text></Text>
      ) : (
        <View style={{ flex: 1, marginTop: responsiveScreenHeight(20) }}>
          {qnaTypes.map((qnaType, index) => {
            const navigation = useNavigation();
            const qnaTypeId = qnaType.qnaTypeId;
            return (
              <TouchableOpacity
                key={qnaTypeId}
                onPress={() =>
                  navigation.navigate('Stack', {
                    screen: 'Inquiry',
                    params: {
                      qnaTypeId,
                    },
                  })
                }
              >
                <View key={qnaTypeId} style={styles.qnaTypeContainer}>
                  <Text style={styles.qnaTypeText}>
                    {`${index + 1}. `}
                    {qnaType.name}
                  </Text>
                  <Ionicons
                    style={{ marginLeft: responsiveScreenWidth(5) }}
                    size={22}
                    color={'#9388E8'}
                    name="chevron-forward-outline"
                  ></Ionicons>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  selectQnaType: {
    marginTop: responsiveScreenHeight(15),
    color: '#000000',
    fontSize: responsiveScreenFontSize(3.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  qnaTypeContainer: {
    justifyContent: 'flex-start',
    marginTop: responsiveScreenHeight(7),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  qnaTypeText: {
    color: '#000000',
    fontSize: responsiveScreenFontSize(2.3),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  bookmarkedKoreanSentences: {
    color: '#000000',
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    marginBottom: responsiveScreenHeight(1),
  },
  bookmarkedSentences: {
    color: '#000000',
    fontSize: responsiveScreenFontSize(2),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  bookmarkedIconContainer: {
    position: 'absolute',
    right: responsiveScreenWidth(-2),
    top: responsiveScreenHeight(-0.5),
    justifyContent: 'flex-end',
  },
});

export default ContactUs;

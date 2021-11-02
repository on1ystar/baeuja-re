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
import { useFocusEffect, useIsFocused } from '@react-navigation/native'; // Navigation
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons
import { Divider, Card } from 'react-native-elements'; // Elements
import { useNavigation } from '@react-navigation/native'; // Navigation
import { Picker } from '@react-native-picker/picker'; // React Native Picker
import * as RNLocalize from 'react-native-localize'; // Localize

let allCountry = [
  {
    name: 'Afghanistan',
    code: 'AF',
  },
  {
    name: 'Åland Islands',
    code: 'AX',
  },
  {
    name: 'Albania',
    code: 'AL',
  },
  {
    name: 'Algeria',
    code: 'DZ',
  },
  {
    name: 'American Samoa',
    code: 'AS',
  },
  {
    name: 'Andorra',
    code: 'AD',
  },
  {
    name: 'Angola',
    code: 'AO',
  },
  {
    name: 'Anguilla',
    code: 'AI',
  },
  {
    name: 'Antarctica',
    code: 'AQ',
  },
  {
    name: 'Antigua and Barbuda',
    code: 'AG',
  },
  {
    name: 'Argentina',
    code: 'AR',
  },
  {
    name: 'Armenia',
    code: 'AM',
  },
  {
    name: 'Aruba',
    code: 'AW',
  },
  {
    name: 'Australia',
    code: 'AU',
  },
  {
    name: 'Austria',
    code: 'AT',
  },
  {
    name: 'Azerbaijan',
    code: 'AZ',
  },
  {
    name: 'Bahamas',
    code: 'BS',
  },
  {
    name: 'Bahrain',
    code: 'BH',
  },
  {
    name: 'Bangladesh',
    code: 'BD',
  },
  {
    name: 'Barbados',
    code: 'BB',
  },
  {
    name: 'Belarus',
    code: 'BY',
  },
  {
    name: 'Belgium',
    code: 'BE',
  },
  {
    name: 'Belize',
    code: 'BZ',
  },
  {
    name: 'Benin',
    code: 'BJ',
  },
  {
    name: 'Bermuda',
    code: 'BM',
  },
  {
    name: 'Bhutan',
    code: 'BT',
  },
  {
    name: 'Bolivia',
    code: 'BO',
  },
  {
    name: 'Bosnia and Herzegovina',
    code: 'BA',
  },
  {
    name: 'Botswana',
    code: 'BW',
  },
  {
    name: 'Bouvet Island',
    code: 'BV',
  },
  {
    name: 'Brazil',
    code: 'BR',
  },
  {
    name: 'British Indian Ocean Territory',
    code: 'IO',
  },
  {
    name: 'Brunei Darussalam',
    code: 'BN',
  },
  {
    name: 'Bulgaria',
    code: 'BG',
  },
  {
    name: 'Burkina Faso',
    code: 'BF',
  },
  {
    name: 'Burundi',
    code: 'BI',
  },
  {
    name: 'Cambodia',
    code: 'KH',
  },
  {
    name: 'Cameroon',
    code: 'CM',
  },
  {
    name: 'Canada',
    code: 'CA',
  },
  {
    name: 'Cape Verde',
    code: 'CV',
  },
  {
    name: 'Cayman Islands',
    code: 'KY',
  },
  {
    name: 'Central African Republic',
    code: 'CF',
  },
  {
    name: 'Chad',
    code: 'TD',
  },
  {
    name: 'Chile',
    code: 'CL',
  },
  {
    name: 'China',
    code: 'CN',
  },
  {
    name: 'Christmas Island',
    code: 'CX',
  },
  {
    name: 'Cocos (Keeling) Islands',
    code: 'CC',
  },
  {
    name: 'Colombia',
    code: 'CO',
  },
  {
    name: 'Comoros',
    code: 'KM',
  },
  {
    name: 'Congo',
    code: 'CG',
  },
  {
    name: 'Congo, The Democratic Republic of the',
    code: 'CD',
  },
  {
    name: 'Cook Islands',
    code: 'CK',
  },
  {
    name: 'Costa Rica',
    code: 'CR',
  },
  {
    name: 'Cote D"Ivoire',
    code: 'CI',
  },
  {
    name: 'Croatia',
    code: 'HR',
  },
  {
    name: 'Cuba',
    code: 'CU',
  },
  {
    name: 'Cyprus',
    code: 'CY',
  },
  {
    name: 'Czech Republic',
    code: 'CZ',
  },
  {
    name: 'Denmark',
    code: 'DK',
  },
  {
    name: 'Djibouti',
    code: 'DJ',
  },
  {
    name: 'Dominica',
    code: 'DM',
  },
  {
    name: 'Dominican Republic',
    code: 'DO',
  },
  {
    name: 'Ecuador',
    code: 'EC',
  },
  {
    name: 'Egypt',
    code: 'EG',
  },
  {
    name: 'El Salvador',
    code: 'SV',
  },
  {
    name: 'Equatorial Guinea',
    code: 'GQ',
  },
  {
    name: 'Eritrea',
    code: 'ER',
  },
  {
    name: 'Estonia',
    code: 'EE',
  },
  {
    name: 'Ethiopia',
    code: 'ET',
  },
  {
    name: 'Falkland Islands (Malvinas)',
    code: 'FK',
  },
  {
    name: 'Faroe Islands',
    code: 'FO',
  },
  {
    name: 'Fiji',
    code: 'FJ',
  },
  {
    name: 'Finland',
    code: 'FI',
  },
  {
    name: 'France',
    code: 'FR',
  },
  {
    name: 'French Guiana',
    code: 'GF',
  },
  {
    name: 'French Polynesia',
    code: 'PF',
  },
  {
    name: 'French Southern Territories',
    code: 'TF',
  },
  {
    name: 'Gabon',
    code: 'GA',
  },
  {
    name: 'Gambia',
    code: 'GM',
  },
  {
    name: 'Georgia',
    code: 'GE',
  },
  {
    name: 'Germany',
    code: 'DE',
  },
  {
    name: 'Ghana',
    code: 'GH',
  },
  {
    name: 'Gibraltar',
    code: 'GI',
  },
  {
    name: 'Greece',
    code: 'GR',
  },
  {
    name: 'Greenland',
    code: 'GL',
  },
  {
    name: 'Grenada',
    code: 'GD',
  },
  {
    name: 'Guadeloupe',
    code: 'GP',
  },
  {
    name: 'Guam',
    code: 'GU',
  },
  {
    name: 'Guatemala',
    code: 'GT',
  },
  {
    name: 'Guernsey',
    code: 'GG',
  },
  {
    name: 'Guinea',
    code: 'GN',
  },
  {
    name: 'Guinea-Bissau',
    code: 'GW',
  },
  {
    name: 'Guyana',
    code: 'GY',
  },
  {
    name: 'Haiti',
    code: 'HT',
  },
  {
    name: 'Heard Island and Mcdonald Islands',
    code: 'HM',
  },
  {
    name: 'Holy See (Vatican City State)',
    code: 'VA',
  },
  {
    name: 'Honduras',
    code: 'HN',
  },
  {
    name: 'Hong Kong',
    code: 'HK',
  },
  {
    name: 'Hungary',
    code: 'HU',
  },
  {
    name: 'Iceland',
    code: 'IS',
  },
  {
    name: 'India',
    code: 'IN',
  },
  {
    name: 'Indonesia',
    code: 'ID',
  },
  {
    name: 'Iran, Islamic Republic Of',
    code: 'IR',
  },
  {
    name: 'Iraq',
    code: 'IQ',
  },
  {
    name: 'Ireland',
    code: 'IE',
  },
  {
    name: 'Isle of Man',
    code: 'IM',
  },
  {
    name: 'Israel',
    code: 'IL',
  },
  {
    name: 'Italy',
    code: 'IT',
  },
  {
    name: 'Jamaica',
    code: 'JM',
  },
  {
    name: 'Japan',
    code: 'JP',
  },
  {
    name: 'Jersey',
    code: 'JE',
  },
  {
    name: 'Jordan',
    code: 'JO',
  },
  {
    name: 'Kazakhstan',
    code: 'KZ',
  },
  {
    name: 'Kenya',
    code: 'KE',
  },
  {
    name: 'Kiribati',
    code: 'KI',
  },
  {
    name: 'Korea, Democratic People"S Republic of',
    code: 'KP',
  },
  {
    name: 'Korea, Republic of',
    code: 'KR',
  },
  {
    name: 'Kuwait',
    code: 'KW',
  },
  {
    name: 'Kyrgyzstan',
    code: 'KG',
  },
  {
    name: 'Lao People"S Democratic Republic',
    code: 'LA',
  },
  {
    name: 'Latvia',
    code: 'LV',
  },
  {
    name: 'Lebanon',
    code: 'LB',
  },
  {
    name: 'Lesotho',
    code: 'LS',
  },
  {
    name: 'Liberia',
    code: 'LR',
  },
  {
    name: 'Libyan Arab Jamahiriya',
    code: 'LY',
  },
  {
    name: 'Liechtenstein',
    code: 'LI',
  },
  {
    name: 'Lithuania',
    code: 'LT',
  },
  {
    name: 'Luxembourg',
    code: 'LU',
  },
  {
    name: 'Macao',
    code: 'MO',
  },
  {
    name: 'Macedonia, The Former Yugoslav Republic of',
    code: 'MK',
  },
  {
    name: 'Madagascar',
    code: 'MG',
  },
  {
    name: 'Malawi',
    code: 'MW',
  },
  {
    name: 'Malaysia',
    code: 'MY',
  },
  {
    name: 'Maldives',
    code: 'MV',
  },
  {
    name: 'Mali',
    code: 'ML',
  },
  {
    name: 'Malta',
    code: 'MT',
  },
  {
    name: 'Marshall Islands',
    code: 'MH',
  },
  {
    name: 'Martinique',
    code: 'MQ',
  },
  {
    name: 'Mauritania',
    code: 'MR',
  },
  {
    name: 'Mauritius',
    code: 'MU',
  },
  {
    name: 'Mayotte',
    code: 'YT',
  },
  {
    name: 'Mexico',
    code: 'MX',
  },
  {
    name: 'Micronesia, Federated States of',
    code: 'FM',
  },
  {
    name: 'Moldova, Republic of',
    code: 'MD',
  },
  {
    name: 'Monaco',
    code: 'MC',
  },
  {
    name: 'Mongolia',
    code: 'MN',
  },
  {
    name: 'Montserrat',
    code: 'MS',
  },
  {
    name: 'Morocco',
    code: 'MA',
  },
  {
    name: 'Mozambique',
    code: 'MZ',
  },
  {
    name: 'Myanmar',
    code: 'MM',
  },
  {
    name: 'Namibia',
    code: 'NA',
  },
  {
    name: 'Nauru',
    code: 'NR',
  },
  {
    name: 'Nepal',
    code: 'NP',
  },
  {
    name: 'Netherlands',
    code: 'NL',
  },
  {
    name: 'Netherlands Antilles',
    code: 'AN',
  },
  {
    name: 'New Caledonia',
    code: 'NC',
  },
  {
    name: 'New Zealand',
    code: 'NZ',
  },
  {
    name: 'Nicaragua',
    code: 'NI',
  },
  {
    name: 'Niger',
    code: 'NE',
  },
  {
    name: 'Nigeria',
    code: 'NG',
  },
  {
    name: 'Niue',
    code: 'NU',
  },
  {
    name: 'Norfolk Island',
    code: 'NF',
  },
  {
    name: 'Northern Mariana Islands',
    code: 'MP',
  },
  {
    name: 'Norway',
    code: 'NO',
  },
  {
    name: 'Oman',
    code: 'OM',
  },
  {
    name: 'Pakistan',
    code: 'PK',
  },
  {
    name: 'Palau',
    code: 'PW',
  },
  {
    name: 'Palestinian Territory, Occupied',
    code: 'PS',
  },
  {
    name: 'Panama',
    code: 'PA',
  },
  {
    name: 'Papua New Guinea',
    code: 'PG',
  },
  {
    name: 'Paraguay',
    code: 'PY',
  },
  {
    name: 'Peru',
    code: 'PE',
  },
  {
    name: 'Philippines',
    code: 'PH',
  },
  {
    name: 'Pitcairn',
    code: 'PN',
  },
  {
    name: 'Poland',
    code: 'PL',
  },
  {
    name: 'Portugal',
    code: 'PT',
  },
  {
    name: 'Puerto Rico',
    code: 'PR',
  },
  {
    name: 'Qatar',
    code: 'QA',
  },
  {
    name: 'Reunion',
    code: 'RE',
  },
  {
    name: 'Romania',
    code: 'RO',
  },
  {
    name: 'Russian Federation',
    code: 'RU',
  },
  {
    name: 'RWANDA',
    code: 'RW',
  },
  {
    name: 'Saint Helena',
    code: 'SH',
  },
  {
    name: 'Saint Kitts and Nevis',
    code: 'KN',
  },
  {
    name: 'Saint Lucia',
    code: 'LC',
  },
  {
    name: 'Saint Pierre and Miquelon',
    code: 'PM',
  },
  {
    name: 'Saint Vincent and the Grenadines',
    code: 'VC',
  },
  {
    name: 'Samoa',
    code: 'WS',
  },
  {
    name: 'San Marino',
    code: 'SM',
  },
  {
    name: 'Sao Tome and Principe',
    code: 'ST',
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
  },
  {
    name: 'Senegal',
    code: 'SN',
  },
  {
    name: 'Serbia',
    code: 'RS',
  },
  {
    name: 'Montenegro',
    code: 'ME',
  },
  {
    name: 'Seychelles',
    code: 'SC',
  },
  {
    name: 'Sierra Leone',
    code: 'SL',
  },
  {
    name: 'Singapore',
    code: 'SG',
  },
  {
    name: 'Slovakia',
    code: 'SK',
  },
  {
    name: 'Slovenia',
    code: 'SI',
  },
  {
    name: 'Solomon Islands',
    code: 'SB',
  },
  {
    name: 'Somalia',
    code: 'SO',
  },
  {
    name: 'South Africa',
    code: 'ZA',
  },
  {
    name: 'South Georgia and the South Sandwich Islands',
    code: 'GS',
  },
  {
    name: 'Spain',
    code: 'ES',
  },
  {
    name: 'Sri Lanka',
    code: 'LK',
  },
  {
    name: 'Sudan',
    code: 'SD',
  },
  {
    name: 'Suriname',
    code: 'SR',
  },
  {
    name: 'Svalbard and Jan Mayen',
    code: 'SJ',
  },
  {
    name: 'Swaziland',
    code: 'SZ',
  },
  {
    name: 'Sweden',
    code: 'SE',
  },
  {
    name: 'Switzerland',
    code: 'CH',
  },
  {
    name: 'Syrian Arab Republic',
    code: 'SY',
  },
  {
    name: 'Taiwan, Province of China',
    code: 'TW',
  },
  {
    name: 'Tajikistan',
    code: 'TJ',
  },
  {
    name: 'Tanzania, United Republic of',
    code: 'TZ',
  },
  {
    name: 'Thailand',
    code: 'TH',
  },
  {
    name: 'Timor-Leste',
    code: 'TL',
  },
  {
    name: 'Togo',
    code: 'TG',
  },
  {
    name: 'Tokelau',
    code: 'TK',
  },
  {
    name: 'Tonga',
    code: 'TO',
  },
  {
    name: 'Trinidad and Tobago',
    code: 'TT',
  },
  {
    name: 'Tunisia',
    code: 'TN',
  },
  {
    name: 'Turkey',
    code: 'TR',
  },
  {
    name: 'Turkmenistan',
    code: 'TM',
  },
  {
    name: 'Turks and Caicos Islands',
    code: 'TC',
  },
  {
    name: 'Tuvalu',
    code: 'TV',
  },
  {
    name: 'Uganda',
    code: 'UG',
  },
  {
    name: 'Ukraine',
    code: 'UA',
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
  },
  {
    name: 'United Kingdom',
    code: 'GB',
  },
  {
    name: 'United States',
    code: 'US',
  },
  {
    name: 'United States Minor Outlying Islands',
    code: 'UM',
  },
  {
    name: 'Uruguay',
    code: 'UY',
  },
  {
    name: 'Uzbekistan',
    code: 'UZ',
  },
  {
    name: 'Vanuatu',
    code: 'VU',
  },
  {
    name: 'Venezuela',
    code: 'VE',
  },
  {
    name: 'Viet Nam',
    code: 'VN',
  },
  {
    name: 'Virgin Islands, British',
    code: 'VG',
  },
  {
    name: 'Virgin Islands, U.S.',
    code: 'VI',
  },
  {
    name: 'Wallis and Futuna',
    code: 'WF',
  },
  {
    name: 'Western Sahara',
    code: 'EH',
  },
  {
    name: 'Yemen',
    code: 'YE',
  },
  {
    name: 'Zambia',
    code: 'ZM',
  },
  {
    name: 'Zimbabwe',
    code: 'ZW',
  },
];

const Profile = () => {
  const navigation = useNavigation();
  const [randomNumber, setRandomNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('');
  const [roleId, setRoleId] = useState(0);

  let changedNickname;
  let changedCountry;

  // 유저 정보 호출
  const loadProfileData = () => {
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: { success, user, tokenExpired, errorMessage },
        } = await axios.get(`https://dev.k-peach.io/users/777`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\nuser: ${user}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Getting User Detail');

        setEmail(user.email);
        setNickname(user.nickname);
        setCountry(user.country);
        setTimezone(user.timezone);
        setRoleId(user.roleId);
        setIsLoading(() => false);

        console.log(user.nickname);
        console.log(user.country);
        console.log(user.timezone);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 닉네임 변경 함수
  const changeNickname = () => {
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;

        if (Platform.OS === 'android') {
          changedNickname = {
            updatingValue: `${nickname}`,
          };
        }

        const {
          data: { success, user, tokenExpired, errorMessage },
        } = await axios.patch(`https://dev.k-peach.io/users/777?column=nickname`, changedNickname, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\nNickname: ${user.nickname}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Change User Nickname');

        setNickname(user.nickname);
        setIsLoading(() => false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 국가 변경 함수
  const changeCountry = () => {
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;

        if (Platform.OS === 'android') {
          changedCountry = {
            updatingValue: `${country}`,
          };
        }

        const {
          data: { success, user, tokenExpired, errorMessage },
        } = await axios.patch(`https://dev.k-peach.io/users/777?column=country`, changedCountry, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (tokenExpired) {
          // login으로 redirect
        }
        console.log(`success : ${success}\nCountry: ${user.country}`);

        if (!success) throw new Error(errorMessage);

        console.log('Success Change User Country');

        setCountry(user.country);
        setIsLoading(() => false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  // useEffect
  useEffect(loadProfileData, []);

  // Profile 화면 전체 리턴
  return (
    <View style={styles.container}>
      {isLoading ? (
        <></>
      ) : (
        <View style={styles.container}>
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: responsiveFontSize(2.5), color: '#000000' }}>
                Hello {nickname}
              </Text>
              {roleId == 2 ? (
                <Text style={{ fontSize: responsiveFontSize(2.5), color: '#000000' }}>
                  You are a google member
                </Text>
              ) : (
                <Text style={{ fontSize: responsiveFontSize(2.5), color: '#000000' }}>
                  You are a guest member
                </Text>
              )}
            </View>
          </Card>

          {/* Email 항목 */}
          <Card
            containerStyle={{
              borderWidth: 0,
              borderRadius: 10,
              backgroundColor: '#FBFBFB',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(40) }}>
                <Text style={{ color: '#9388E8' }}>Email</Text>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  {email}
                </Text>
              </View>
              <View
                style={{
                  width: responsiveScreenWidth(40),
                  marginLeft: responsiveScreenWidth(15),
                  marginTop: responsiveScreenHeight(1.5),
                }}
              >
                <TouchableOpacity style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#444444', fontSize: responsiveFontSize(1.5) }}>
                    Switch to Google
                  </Text>
                  <Ionicons size={20} color={'#444444'} name="chevron-forward-outline"></Ionicons>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Nickname 항목 */}
          <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(40) }}>
                <Text style={{ color: '#9388E8' }}>Nickname</Text>
                {/* <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  {nickname}
                </Text> */}
                <TextInput
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.qnaTitleInput}
                  placeholder="Please enter Nickname..."
                  placeholderTextColor="#444444"
                  value={nickname}
                  onChangeText={(text) => setNickname(text)}
                ></TextInput>
              </View>
              <View
                style={{
                  width: responsiveScreenWidth(40),
                  marginLeft: responsiveScreenWidth(15),
                  marginTop: responsiveScreenHeight(1.5),
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    changeNickname();
                  }}
                >
                  <Text style={{ color: '#444444', fontSize: responsiveFontSize(1.5) }}>
                    Change Nickname
                  </Text>
                  <Ionicons size={20} color={'#444444'} name="chevron-forward-outline"></Ionicons>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Country 항목 */}
          <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(40) }}>
                <Text style={{ color: '#9388E8' }}>Country</Text>
                {/* <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  {country}
                </Text> */}
                <View
                  style={{
                    backgroundColor: '#FDFDFD',
                    borderColor: '#000000',
                    color: '#000000',
                    paddingBottom: 0,
                    paddingTop: 0,
                    paddingRight: 0,
                    paddingLeft: 0,
                    height: responsiveScreenHeight(6.5),
                    width: responsiveScreenWidth(42),
                    borderWidth: 0.5,
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
                    selectedValue={country}
                    onValueChange={(itemValue, itemIndex) => setCountry(itemValue)}
                  >
                    {allCountry.map((nation) => {
                      return (
                        <Picker.Item
                          style={{ fontSize: responsiveFontSize(1.5) }}
                          label={nation.name}
                          value={nation.code}
                          key={nation.name}
                        />
                      );
                    })}
                  </Picker>
                </View>
              </View>
              <View
                style={{
                  width: responsiveScreenWidth(40),
                  marginLeft: responsiveScreenWidth(15),
                  marginTop: responsiveScreenHeight(3.5),
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    changeCountry();
                  }}
                >
                  <Text style={{ color: '#444444', fontSize: responsiveFontSize(1.5) }}>
                    Change Country
                  </Text>
                  <Ionicons size={20} color={'#444444'} name="chevron-forward-outline"></Ionicons>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Timezone 항목 */}
          <Card containerStyle={{ borderWidth: 0, borderRadius: 10, backgroundColor: '#FBFBFB' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: responsiveScreenWidth(40) }}>
                <Text style={{ color: '#9388E8' }}>Timezone</Text>
                <Text style={{ color: '#000000' }} numberOfLines={1} ellipsizeMode="tail">
                  {timezone}
                </Text>
              </View>
              <View
                style={{
                  width: responsiveScreenWidth(40),
                  marginLeft: responsiveScreenWidth(15),
                  marginTop: responsiveScreenHeight(1.5),
                }}
              >
                <TouchableOpacity style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#444444', fontSize: responsiveFontSize(1.5) }}>
                    Change Timezone
                  </Text>
                  <Ionicons size={20} color={'#444444'} name="chevron-forward-outline"></Ionicons>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  qnaTitleInput: {
    borderRadius: 5,
    fontSize: responsiveFontSize(1.5),
    color: '#000000',
    paddingBottom: 0,
    paddingTop: 0,
    height: responsiveScreenHeight(3),
    width: responsiveScreenWidth(40),
    borderWidth: 0.2,
  },
});

export default Profile;

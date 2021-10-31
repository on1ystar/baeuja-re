// Library import
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
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
import { Card } from 'react-native-elements'; // React Native Elements

const MoreInfo = ({
  route: {
    params: { contentId },
  },
  navigation: { navigate },
}) => {
  const [thumbnailUri, setThumbNailUri] = useState(null);
  const [title, setTitle] = useState(null);
  const [artist, setArtist] = useState(null);
  const [director, setDirector] = useState(null);
  const [description, setDescription] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('token', async (error, token) => {
      try {
        if (token === null) {
          // login으로 redirect
        }
        if (error) throw error;
        const {
          data: {
            success,
            content: { thumbnailUri, title, artist, director, description, youtubeUrl },
          },
        } = await axios(`https://dev.k-peach.io/learning/contents/${contentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //   if (tokenExpired) {
        //     // login으로 redirect
        //   }

        console.log('success getting More Information');

        setThumbNailUri(thumbnailUri);
        setTitle(title);
        setArtist(artist);
        setDescription(description);
        setYoutubeUrl(youtubeUrl);

        if (!success) throw new Error(errorMessage);
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.allContainer}>
      <ScrollView style={{ flex: 1, marginBottom: responsiveScreenHeight(10) }}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {artist} - {title}
          </Text>
        </View>
        <View style={styles.thumbnailImageContainer}>
          {/* <Image
            style={styles.thumbnailImage}
            transitionDuration={1000}
            source={{
              uri: thumbnailUri,
            }}
          /> */}
          <Image
            transitionDuration={1000}
            source={require('../../assets/img/1_b.png')}
            style={styles.thumbnailImage}
          />
        </View>
        <View>
          {/* 유튜브 링크 오픈 아이콘 */}
          <TouchableOpacity
            onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${youtubeUrl}`)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: responsiveScreenHeight(2),
            }}
          >
            <Text style={{ color: '#444444', fontSize: responsiveFontSize(1.2) }}>
              Watch full video on youtube
            </Text>
            <Ionicons size={30} color={'#C4302B'} name="logo-youtube"></Ionicons>
          </TouchableOpacity>
        </View>
        <Card
          containerStyle={{ borderRadius: 10, marginTop: responsiveScreenHeight(2) }}
          style={styles.descriptionContainer}
        >
          <Text style={styles.description}>{description}</Text>
        </Card>
      </ScrollView>
      <View style={styles.Container}>
        <TouchableOpacity
          onPress={() =>
            navigate('Stack', {
              screen: 'LearningUnits',
              params: {
                contentId,
              },
            })
          }
          style={styles.goToLearnContainer}
        >
          <Text style={styles.goToLearn}>Go to Learn</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MoreInfo;

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // backgroundColor: '#FFFFFF',
    width: responsiveScreenWidth(100),
    bottom: responsiveScreenHeight(0),
  },
  thumbnailImageContainer: {
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  titleContainer: {
    marginTop: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#666666',
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
  },
  goToLearnContainer: {
    marginTop: 25,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9388E8',
    width: responsiveScreenWidth(80),
    height: responsiveHeight(5),
    borderRadius: 10,
  },
  goToLearn: {
    color: 'white',
    fontFamily: 'NanumSquareOTFB',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(2.2),
  },
  description: {
    color: '#666666',
  },
});

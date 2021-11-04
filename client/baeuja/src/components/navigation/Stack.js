/* eslint-disable react/prop-types */

// Library import
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Stack Navigation
import { View, Text, TouchableOpacity } from 'react-native'; // React Native Component

// Screen import
import Login from '../../screens/login/Login';
import GetKpopLearningContents from '../learning/GetKpopLearningContents';
import LearningWord from '../../screens/learning/LearningWord';
import LearningUnits from '../../screens/learning/LearningUnits';
import LearningUnit from '../../screens/learning/LearningUnit';
import MoreInfo from '../../screens/learning/MoreInfo';
import ContactUs from '../../screens/my/ContactUs';
import qnaInput from '../qna/qnaInput';
import Help from '../../screens/learning/Help';
import WordsReview from '../../screens/review/WordsReview';
import SentencesReview from '../../screens/review/SentencesReview';
import Profile from '../../screens/my/Profile';
import LearningStatus from '../../screens/my/LearningStatus';
import AboutUs from '../../screens/my/AboutUs';
import BookmarkSortModal from '../../screens/bookmark/BookmarkSortModal';

const NativeStack = createNativeStackNavigator();

const Stack = () => (
  <NativeStack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerBackTitleVisible: false,
      headerTintColor: '#9388E8',
      backgroundColor: '#FFFFFF',
    }}
    sceneContainerStyle={{
      backgroundColor: '#FFFFFF',
    }}
  >
    <NativeStack.Screen name="Login" options={{ headerShown: false }} component={Login} />
    <NativeStack.Group screenOptions={{ presentation: 'modal' }}>
      <NativeStack.Screen name="Song Info" component={MoreInfo} />
      <NativeStack.Screen name="Help" component={Help} />
    </NativeStack.Group>
    <NativeStack.Screen name="K-pop" component={GetKpopLearningContents} />
    <NativeStack.Screen name="Learning Word" component={LearningWord} />
    <NativeStack.Screen options={{ flex: 1 }} name="Units" component={LearningUnits} />
    <NativeStack.Screen name="Learning Unit" component={LearningUnit} />
    <NativeStack.Screen name="Sort Options" component={BookmarkSortModal} />
    <NativeStack.Screen name="Words Review" component={WordsReview} />
    <NativeStack.Screen name="Sentences Review" component={SentencesReview} />
    <NativeStack.Screen name="Profile" component={Profile} />
    <NativeStack.Screen name="Learning Status" component={LearningStatus} />
    <NativeStack.Screen name="Contact Us" component={ContactUs} />
    <NativeStack.Screen name="Inquiry" component={qnaInput} />
    <NativeStack.Screen name="About Us" component={AboutUs} />
  </NativeStack.Navigator>
);

export default Stack;

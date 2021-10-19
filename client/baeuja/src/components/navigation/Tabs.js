// Library import
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Tab Navigation
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons
import { responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'; // RN responsive Screen
import Antdesign from 'react-native-vector-icons/AntDesign'; // AntDesign

// Screnn import
import LearningMain from '../../screens/learning/LearningMain';
import Bookmark from '../../screens/bookmark/Bookmark';
import Home from '../../screens/home/Home';
import Review from '../../screens/review/Review';
import My from '../../screens/my/My';

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarActiveTintColor: '#9388E8',
      tabBarInactiveTintColor: '#CCCCCC',
      headerShown: false,
    }}
    sceneContainerStyle={{
      backgroundColor: '#FFFFFF',
    }}
  >
    <Tab.Screen
      name="Learning"
      component={LearningMain}
      options={{
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name={focused ? 'book' : 'book-outline'} color={color} size={size} />;
        },
      }}
    />
    <Tab.Screen
      name="Bookmark"
      component={Bookmark}
      options={{
        tabBarIcon: ({ focused, color, size }) => {
          return <Antdesign name={focused ? 'star' : 'staro'} color={color} size={size} />;
        },
      }}
    />
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ focused, color, size }) => {
          return <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size} />;
        },
      }}
    />
    {/* <Tab.Screen
      name="Review"
      component={Review}
      options={{
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <Ionicons name={focused ? 'reader' : 'reader-outline'} color={color} size={size} />
          );
        },
      }}
    /> */}
    <Tab.Screen
      name="My"
      component={My}
      options={{
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={size} />
          );
        },
      }}
    />
  </Tab.Navigator>
);

export default Tabs;

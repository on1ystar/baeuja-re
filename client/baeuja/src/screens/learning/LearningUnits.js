/* eslint-disable react/prop-types */

// Library import
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native'; // React Native Component
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
  useResponsiveFontSize,
} from 'react-native-responsive-dimensions'; // Responsive Layout

// Component
import GetUnits from '../../components/learning/GetUnits';

const LearningUnits = ({
  route: {
    params: { contentId, contentTitle },
  },
}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.allContainer}>
        <GetUnits contentId={contentId} contentTitle={contentTitle} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default LearningUnits;

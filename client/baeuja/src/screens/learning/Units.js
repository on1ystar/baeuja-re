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

// class Unit extends React.Component {
//   render() {
//     const { navigation } = this.props;

//     return (
//       <ScrollView>
//         <View style={styles.allContainer}>
//           <GetUnits />
//         </View>
//       </ScrollView>
//     );
//   }
// }

const Units = ({
  route: {
    params: { contentId },
  },
}) => {
  return (
    <ScrollView>
      <View style={styles.allContainer}>
        <GetUnits contentId={contentId} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  allContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Units;

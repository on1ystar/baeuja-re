// Library import
import React from 'react';
import { StyleSheet, Text, View } from 'react-native'; // React Native Component

class Review extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Review Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Review;

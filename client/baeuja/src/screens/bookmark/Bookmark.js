// Library import
import React from 'react';
import { StyleSheet, Text, View } from 'react-native'; // React Native Component

class Bookmark extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Bookmark Screen</Text>
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

export default Bookmark;

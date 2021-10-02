// Library import
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'; // React Native Component

class Home extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.container}>
        <Text>Home Screen</Text>
      </TouchableOpacity>
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

export default Home;

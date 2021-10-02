/* eslint-disable react/prop-types */

// Library import
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // React Native Component

const My = ({ navigation: { navigate } }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigate('Stack', { screen: 'Three' })}
      >
        <Text>My Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigate('Stack', { screen: 'Login' })}
      >
        <Text>Go to Login Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default My;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ProductPage = () => {
  return (
    <View style={styles.header}>
      <Text>Product Page</Text>
      <Text>Show image here show image there, add to cart button here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProductPage;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Products = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Text>Products</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Product Page')}>
        <Text style={styles.btnText}> Go to Product Page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    margin: 10,
    padding: 10,
  },
  btnText: {
    color: 'blue',
  },
});

export default Products;

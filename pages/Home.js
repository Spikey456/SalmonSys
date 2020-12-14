/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function Home({navigation, route}) {
  return (
    <View style={styles.container}>
      <Text>Hello {route.params.user.user.name}</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Products');
        }}>
        <Image
          source={require('../assets/SalmonHome.jpg')}
          style={{
            width: 400,
            height: 200,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Cart');
        }}>
        <Image
          source={require('../assets/CartHome.jpg')}
          style={{
            width: 400,
            height: 200,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
});

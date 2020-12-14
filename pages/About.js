/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {firebase} from '../components/firebase';
import CartItems from '../components/CartItems';
import Spinner from 'react-native-loading-spinner-overlay';

const About = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('../assets/about.jpg')}
        style={{
          width: 300,
          height: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
    </View>
  );
};

export default About;

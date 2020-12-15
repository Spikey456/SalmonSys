/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  ScrollView,
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
    <ScrollView

      contentContainerStyle={{
        flex: 1,
        alignItems: 'center',
      }}
      >
      <Image
        source={require('../assets/about.jpg')}
        resizeMode='cover'
        style={{
          width: 400,
          height: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
    </ScrollView>
  );
};

export default About;

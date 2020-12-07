import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {firebase} from '../components/firebase';

const Cart = ({route}) => {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    let array = [];
    for (const [key, value] of Object.entries(route.params.user.user.cart)) {
      array.push(value);
    }
    setCartItems([...cartItems, array]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);
  return (
    <Text>
      {route.params.user.user.cart ? 'HAS ITEMS IN CART' : 'HAS NO ITEMS'}
    </Text>
  );
};

export default Cart;

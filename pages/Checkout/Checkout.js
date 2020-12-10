import React, {useState, useEffect} from 'react';
import {Card, Title} from 'react-native-paper';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {firebase} from '../components/firebase';

const Checkout = ({route}) => {
    const [userCheckout, setUserCheckout] = useState(null);

    useEffect(() => {
        setUserCheckout(route.params.user.user)
    })
}

export default Checkout;
/* eslint-disable react-native/no-inline-styles */
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
import {RadioButton} from 'react-native-paper';
import {firebase} from '../../components/firebase';
import Spinner from 'react-native-loading-spinner-overlay';

const Checkout = ({route}) => {
  const [userCheckout, setUserCheckout] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingCheckout, setLoadingCheckout] = useState(true);
  /*checkout:

created: timestamp
fulfilled
pickupDate: YYYY-MM-DD
products
shippingMethod: delivery or shipping
status: unfulfilled
subtotal
total
user*/

  useEffect(() => {
    firebase
      .database()
      .ref(`customers/${route.params.user.uid}/checkout`)
      .once('value')
      .then((snap) => {
        
        setUserCheckout(snap.val());
        
      });
  }, []);

  useEffect(() => {
    if(userCheckout !== null){
      setLoadingCheckout(false);
    }
    console.log(route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK')
    console.log(userCheckout);
  }, [userCheckout]);

  return (
    <View>
      <Spinner
        visible={loadingCheckout}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
      <Card>
        <Card.Content>
          <View style={{
            flex: 1,

          }}>

          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default Checkout;

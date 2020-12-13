/* eslint-disable react-hooks/exhaustive-deps */
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
import CheckoutItems from '../../components/CheckoutItems';
import {firebase} from '../../components/firebase';
import Spinner from 'react-native-loading-spinner-overlay';
//import styles from '../LoginScreen/styles';

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
    let array = [];
    setProducts([]);
    firebase
      .database()
      .ref(`customers/${route.params.user.uid}/checkout`)
      .once('value')
      .then((snap) => {
        setUserCheckout(snap.val());
        firebase
          .database()
          .ref(`customers/${route.params.user.uid}/checkout/products`)
          .once('value')
          .then((snapProduct) => {
            for (const [key, value] of Object.entries(snapProduct.val())) {
              value.id = key;
              //console.log(value);
              array.push(value);
            }
            setProducts([array]);
          });
      });
  }, []);

  useEffect(() => {
    if (userCheckout !== null) {
      setLoadingCheckout(false);
    }
    console.log(route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK');
    console.log(userCheckout);
    console.log('Henlooo');
  }, [userCheckout]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
      }}>
      <Spinner
        visible={loadingCheckout}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            marginTop: 150,
            marginLeft: 50,
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
          <Text style={styles.headerText}>Name:</Text>
          <Text style={styles.headerText}>Role:</Text>
          <Text style={styles.headerText}>Shipping Method:</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginTop: 150,

            justifyContent: 'center',
          }}>
          <Text style={styles.subText}>{route.params.user.user.name}</Text>
          <Text style={styles.subText}>
            {route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK'
              ? 'Reseller'
              : 'Wholesaler'}
          </Text>
          <Text style={styles.subText}>
            {route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK'
              ? 'Pickup'
              : 'Delivery'}
          </Text>
        </View>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderItem={({item}) => {
          console.log('item: ');
          console.log(item);
          let counter = 0;
          return item.map((cart) => {
            console.log(cart);
            return (
              <CheckoutItems
                key={cart.id}
                cartItem={cart}
                user={route.params.user}
              />
            );
          });
          /*return (
              <CartItems
                cartItem={item}
                loading={loadingCart}
                setLoading={setLoadingCart}
                user={route.params.user}
              />
            );*/
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff7334',
  },
  subText: {
    fontSize: 20,
    fontWeight: 'normal',
  },
});

export default Checkout;

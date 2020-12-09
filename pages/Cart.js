/* eslint-disable react-native/no-inline-styles */
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {firebase} from '../components/firebase';
import CartItems from '../components/CartItems';
import Spinner from 'react-native-loading-spinner-overlay';

const Cart = ({route}) => {
  //const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const refreshCart = () => {
    setLoadingCart(true);
    console.log('Refreshing..');
    setCartItems([]);
    let array = [];
    firebase
      .database()
      .ref(`customers/${route.params.user.uid}/cart`)
      .once('value')
      .then((snap) => {
        for (const [key, value] of Object.entries(snap.val())) {
          array.push(value);
        }

        setRefresh(false);
        setCartItems([array]);
        //console.log('Henlooo');
        //console.log(snap.val());
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    setLoadingCart(true);
    if (cartItems.length === 0) {
      refreshCart();
      setLoadingCart(true);
    }

    //setLoadingCart(false);
    //console.log('CART');
    //console.log(route.params.cart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //console.log(cartItems);
    if (cartItems) {
      if (cartItems.length > 0) {
        setTimeout(function () {
          setLoadingCart(false);
        }, 500);
      }
    }
  }, [cartItems]);

  if (cartItems.length === 0 || refresh) {
    return (
      <View>
        <Spinner
          visible={loadingCart}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
        <Text>No items in cart</Text>
      </View>
    );
  } else {
    //return <Text>Display Cart</Text>
    return (
      <View>
        <Spinner
          visible={loadingCart}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
        <FlatList
          data={cartItems}
          extraData={refresh || loadingCart}
          renderItem={({item}) => {
            console.log('item: ');
            console.log(item);
            let counter = 0;
            return item.map((cart) => {
              console.log(cart);
              return (
                <CartItems
                  cartItem={cart}
                  loading={loadingCart}
                  setLoading={setLoadingCart}
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
        <TouchableOpacity
          style={{
            backgroundColor: '#124a04',
            marginLeft: 10,
            marginRight: 30,
            marginTop: 40,
            height: 50,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            //addToCart();
            //updateQuantity(cartItem.id);
            setCartItems([]);
            setRefresh(true);
            setLoadingCart(true);
            setTimeout(function () {
              refreshCart();
            }, 500);
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              paddingLeft: 10,
              paddingRight: 10,
              fontWeight: 'bold',
            }}>
            Refresh
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default Cart;

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
import {RadioButton, Modal, Button} from 'react-native-paper';
import CheckoutItems from '../../components/CheckoutItems';
import {firebase} from '../../components/firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
//import styles from '../LoginScreen/styles';

const Checkout = ({navigation, route}) => {
  const [userCheckout, setUserCheckout] = useState(null);
  const [products, setProducts] = useState(null);
  const [loadingCheckout, setLoadingCheckout] = useState(true);
  const [subtotal] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(
    route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK' ? 0 : 1000,
  );

  const imgDefault =
    'https://img2.pngio.com/documentation-screenshotlayer-api-default-png-250_250.png';
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
    setProducts(null);
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
            if (snapProduct) {
              for (const [key, value] of Object.entries(snapProduct.val())) {
                value.id = key;
                //console.log(value);
                array.push(value);
              }
              setProducts(array);
            }
          });
      });
  }, []);

  useEffect(() => {
    console.log('PRODUCTSS');
    console.log(subtotal);
    var sum = subtotal.reduce((a, b) => {
      return a + b;
    }, 0);

    console.log(sum);
    if (total < 1001) {
      setTotal(total + sum);
    }
  }, [subtotal]);

  useEffect(() => {
    console.log('TOtla' + total);
  }, [total]);

  const getSubtotal = () => {
    var sum = subtotal.reduce((a, b) => {
      return a + b;
    }, 0);

    return sum;
  };

  const placeOrder = () => {
    setLoadingCheckout(true);
    let currentTime = moment().toJSON();
    console.log(currentTime);
    let newOrder = userCheckout;
    newOrder.status = 'UNFULFILLED';
    newOrder.fulfilled = 'N/A';
    newOrder.created = currentTime;
    newOrder.total = total;
    newOrder.shippingMethod =
      route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK'
        ? 'Pickup'
        : 'Delivery';
    newOrder.subtotal = getSubtotal();
    newOrder.user = route.params.user.user;
    newOrder.user.id = route.params.user.uid;
    firebase
      .database()
      .ref('orders')
      .push(newOrder)
      .then(() => {
        firebase
          .database()
          .ref(`customers/${route.params.user.uid}/checkout`)
          .remove()
          .then(() => {
            firebase
              .database()
              .ref(`customers/${route.params.user.uid}/cart`)
              .remove()
              .then(() => {
                console.log('Order has been placed!');
                setLoadingCheckout(false);
                setShowModal(true);
              });
          });
      });
    console.log(newOrder);
  };

  useEffect(() => {
    if (userCheckout !== null) {
      setLoadingCheckout(false);
    }
    //console.log(route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK');
    //console.log(userCheckout);
    //console.log('Henlooo');
  }, [userCheckout]);

  if (products) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: 'white',
        }}>
        <Spinner
          visible={loadingCheckout || !products}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              marginTop: 50,
              marginLeft: 50,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <Text style={styles.headerText}>Name:</Text>
            <Text style={styles.headerText}>Role:</Text>
            <Text style={styles.headerText}>Shipping Method:</Text>
            <Text style={styles.headerText}>Pickup/Delivery Date:</Text>
            {route.params.user.user.role !== '-MM7epSByKyZ4VVVPBYK' && (
              <Text style={styles.headerText}>Delivery Fee:</Text>
            )}
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginTop: 50,

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
            <Text style={styles.subText}>{userCheckout.pickupDate}</Text>
            {route.params.user.user.role !== '-MM7epSByKyZ4VVVPBYK' && (
              <Text style={styles.subText}>PHP 1,000</Text>
            )}
          </View>
        </View>
        <View>
          {products.map((cartItem, index) => {
            console.log(index);
            console.log('Rendering Checkout Item');
            console.log(cartItem);
            (subtotal[index] =
              route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK'
                ? cartItem.product.quantity > 15
                  ? cartItem.subtotals.subtotalReseller
                  : cartItem.subtotals.subtotalShopPrice
                : cartItem.product.quantity > 30
                ? cartItem.subtotals.subtotalWholeSaler
                : cartItem.subtotals.subtotalReseller),
              /*setSubtotal(
              route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK'
                ? cartItem.product.quantity > 15
                  ? subtotal + cartItem.subtotals.subtotalReseller
                  : subtotal + cartItem.subtotals.subtotalShopPrice
                : cartItem.product.quantity > 30
                ? subtotal + cartItem.subtotals.subtotalWholeSaler
                : subtotal + cartItem.subtotals.subtotalReseller,
            );*/
              console.log('carttt');
            console.log(cartItem);
            return (
              <View
                key={cartItem.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                  justifyContent: 'space-around',
                }}>
                <Image
                  source={{
                    uri: cartItem.product.image
                      ? cartItem.product.image
                      : imgDefault,
                  }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 10,
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderColor: '#F44336',
                  }}
                />
                <Text style={styles.subText}>{cartItem.product.name}</Text>
                <Text style={styles.subText}>x{cartItem.product.quantity}</Text>
                <Text style={styles.subText}>
                  {route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK'
                    ? cartItem.product.quantity > 15
                      ? 'PHP' + cartItem.subtotals.subtotalReseller
                      : 'PHP' + cartItem.subtotals.subtotalShopPrice
                    : cartItem.product.quantity > 30
                    ? 'PHP' + cartItem.subtotals.subtotalWholeSaler
                    : 'PHP' + cartItem.subtotals.subtotalReseller}
                </Text>
              </View>
            );
          })}
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <Text style={styles.totalText}>Total: </Text>
          <Text style={styles.totalText}>
            PHP{' '}
            {getSubtotal() +
              (route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK'
                ? 0
                : 1000)}
          </Text>
        </View>

        <View>
          <TouchableOpacity
            style={{
              backgroundColor: '#ff7334',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 20,
              height: 50,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              //addToCart();
              //updateQuantity(cartItem.id);
              console.log('Place order');
              placeOrder();
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                paddingLeft: 10,
                paddingRight: 10,
                fontWeight: 'bold',
              }}>
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
        {/*
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
              );
          }}
        />
        */}
        <Modal
          visible={showModal}
          onDismiss={() => {
            navigation.popToTop() && navigation.navigate('Home');
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 300,
                backgroundColor: '#fff',
                height: 200,
                borderRadius: 20,
              }}>
              <View
                style={{
                  marginTop: 20,
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    padding: 15,
                    color: '#000',
                  }}>
                  Your order has been placed!
                </Text>

                <Button
                  onPress={() => {
                    setShowModal(false);
                  }}>
                  Close
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  } else {
    return <></>;
  }
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff7334',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff7334',
  },
  subText: {
    fontSize: 15,
    fontWeight: 'normal',
  },
});

export default Checkout;

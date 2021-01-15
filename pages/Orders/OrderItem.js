/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Card, Title, Modal} from 'react-native-paper';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {firebase} from '../../components/firebase';

const OrderItem = ({
  orderItem,
  user,
  loading,
  setLoading,
  setSelectProducts,
  setShowOrder,
  setSelectOrder,
  setRefresh,
}) => {
  const [date, getDate] = useState(null);

  function numberWithCommas(x) {
    return 'PHP' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  useEffect(() => {
    let orderDate = new Date(orderItem.created);
    getDate(orderDate.toISOString().split('T')[0]);
  }, []);

  function localizeStatus(status) {
    if (status === 'UNFULFILLED') {
      return 'Unfulfilled';
    } else if (status === 'UNFULFILLED(ORDER_APPROVED)') {
      return 'Unfulfilled(Order Approved)';
    } else if (status === 'IN_TRANSIT') {
      return 'On the way';
    } else if (status === 'FULFILLED') {
      return 'Fulfilled';
    } else if (status === 'CANCELLED') {
      return 'Cancelled';
    } else if (status === 'REQUEST_FOR_CANCEL') {
      return 'Request for cancellation';
    } else if (status === 'REJECTED') {
      return 'Rejected';
    } else if (status === 'READY_TO_PICKUP') {
      return 'Ready to pickup';
    }
  }

  return (
    <>
      <Card style={styles.cardRow} key={orderItem.id}>
        <Card.Title
          title={'Order Placed: ' + date}
          titleStyle={{
            fontSize: 13,
            color: 'grey',
          }}
        />

        <Card.Content>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Title>Status: {localizeStatus(orderItem.status)}</Title>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Text>
                {orderItem.user.role === '-MM7epSByKyZ4VVVPBYK'
                  ? 'Date Pickup: '
                  : 'Date Delivered: '}
              </Text>
              <Text>{orderItem.pickupDate}</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Title style={{color: '#ff7334'}}>Total:</Title>
              <Title style={{color: '#ff7334'}}>
                {numberWithCommas(orderItem.total)}
              </Title>
            </View>
          </View>
        </Card.Content>
        <Card.Actions>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                //addToCart();
                //updateQuantity(cartItem.product.id);
                //removeProduct(cartItem.product.id);
                let array = [];
                console.log('Selected orderr');
                setSelectOrder(orderItem);
                for (const [key, value] of Object.entries(orderItem.products)) {
                  //console.log(key);
                  // console.log(value);
                  array.push(value);
                }
                //console.log(array);
                setSelectProducts(array);
                setShowOrder(true);
              }}>
              <Text style={styles.buttonTitle}>View Order</Text>
            </TouchableOpacity>
          </View>
        </Card.Actions>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRow: {
    margin: 10,
    padding: 10,
    backgroundColor: '#FFF',
    width: '90%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#ff7334',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 35,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
    fontWeight: 'bold',
  },
  btnText: {
    color: 'blue',
  },
});

export default OrderItem;

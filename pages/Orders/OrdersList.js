import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {firebase} from '../../components/firebase';
import {Modal, Title, Button} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import {TouchableOpacity} from 'react-native-gesture-handler';
import OrderItem from './OrderItem';

const OrdersList = ({navigation, route}) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFlatList, setShowFlatList] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [selectOrder, setSelectOrder] = useState(null);
  const [selectProducts, setSelectProducts] = useState([]);
  const [date, setDate] = useState(null);

  const imgDefault =
    'https://img2.pngio.com/documentation-screenshotlayer-api-default-png-250_250.png';

  const refreshOrders = () => {
    setLoadingOrders(true);
    let array = [];

    firebase
      .database()
      .ref('orders')
      .orderByChild('user/id')
      .equalTo(route.params.user.uid)
      .once('value')
      .then((snap) => {
        let field = snap.val();
        //console.log(field);
        for (const [key, value] of Object.entries(field)) {
          value.id = key;
          array.push(value);
          //console.log(key);
          //console.log(value);
        }
        setOrders(array);
        setShowFlatList(true);
        setLoadingOrders(false);
        setRefreshing(false);
        setLoadingOrders(false);

        console.log('Orders FOUND!');
      });
  };

  useEffect(() => {
    if (orders.length === 0) {
      refreshOrders();
    }
  });

  useEffect(() => {
    if (selectOrder) {
      let orderDate = new Date(selectOrder.created);
      setDate(orderDate.toISOString().split('T')[0]);
    }
  }, [selectOrder]);

  useEffect(() => {
    if (selectProducts) {
      console.log('PRODUCTS');
      console.log(selectProducts);
    }
  }, [selectProducts]);

  useEffect(() => {
    if (orders.length > 0) {
      console.log('FIND THIS!');
      console.log(orders.length);
    }
  }, [orders]);

  function numberWithCommas(x) {
    return 'PHP' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

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

  /**    <FlatList
          data={orders}
          extraData={loadingOrders || refreshing}
          renderItem={({item}) => {
            console.log("ITEM FOUND");
            console.log(item);
          }}
          keyExtractor={(item) => {
            return item.id;
          }}
          refreshing={refreshing}
          onRefresh={() => {
            setOrders([]),
              setLoadingOrders(true),
              refreshOrders(),
              setRefreshing(true);
          }}
        /> */

  if (loadingOrders || refreshing || !showFlatList || orders.length === 0) {
    return (
      <View>
        <Spinner
          visible={loadingOrders || refreshing || !showFlatList}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
      </View>
    );
  } else {
    return (
      <View style={{flex: 1}}>
        {orders.length > 0 && showFlatList ? (
          <>
            <FlatList
              data={orders}
              extraData={loadingOrders || refreshing}
              renderItem={({item}) => {
                //console.log('ITEM FOUND');
                //console.log(item);
                return (
                  <OrderItem
                    orderItem={item}
                    setShowOrder={setShowOrder}
                    setSelectOrder={setSelectOrder}
                    setSelectProducts={setSelectProducts}
                    key={item.id}
                  />
                );
              }}
              keyExtractor={(item) => {
                return item.id;
              }}
              refreshing={refreshing}
              onRefresh={() => {
                setOrders([]),
                  setLoadingOrders(true),
                  refreshOrders(),
                  setRefreshing(true);
              }}
            />

            <Modal
              visible={showOrder && selectOrder && selectProducts}
              onDismiss={() => {
                setShowOrder(false);
                setSelectOrder(null);
                setSelectProducts([]);
              }}
              contentContainerStyle={{
                backgroundColor: 'white',
                padding: 20,
                width: '90%',
                height: '80%',
                alignSelf: 'center',
              }}>
              {selectOrder && selectProducts && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    
                  }}>
                  <Text style={{fontSize: 13, color: 'grey'}}>
                    Order Placed: {date}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'column',
                      marginTop: 50,
                      alignItems: 'center',
                      
                    }}>
                   
                      <Title>Status: <Text style={{paddingLeft: 50,color: '#ff7334'}}>{localizeStatus(selectOrder.status)}</Text></Title>
                      <Title>
                        {route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK'
                          ? 'Pickup Date:'
                          : 'Delivery Date:'} 
                          <Text style={{paddingLeft: 50,color: '#ff7334'}}> {selectOrder.pickupDate}</Text>
                      </Title>
                      <Title>Customer Type: <Text style={{paddingLeft: 50,color: '#ff7334'}}>{route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK'
                          ? 'Reseller'
                          : 'Wholesaler'}</Text></Title>
               
                 
                  </View>
                  
                  <View
                    style={{
                      marginTop: 25,
                    }}
                  >
                    <Title>Products: </Title>
                  </View>

                  {selectProducts.map((item) => {
                    console.log('HAS ITEMS!');
                    console.log(item);
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          borderColor: 'black',
                          borderWidth: 0.5,
                          borderRadius: 10
                        }}>
                        <Image
                          source={{
                            uri: item.product.image
                              ? item.product.image
                              : imgDefault,
                          }}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 10,
                            alignSelf: 'flex-start',
                            borderWidth: 1,
                            borderColor: '#F44336',
                          }}
                        />
                        <Text>{item.product.name}</Text>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 'normal',
                          }}>
                          x{item.product.quantity}
                        </Text>
                        <Text>
                          {numberWithCommas(
                            route.params.user.user.role ===
                              '-MM7epSByKyZ4VVVPBYK'
                              ? item.subtotals.subtotalReseller
                              : item.subtotals.subtotalWholeSaler,
                          )}
                        </Text>
                        <View 
                          style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                          }}
                        />
                      </View>
                    );
                  })}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 25,
                    }}>
                    <Title style={{color: '#ff7334'}}>Total: {numberWithCommas(selectOrder.total)}</Title>
                  </View>
                  {selectOrder.status === 'UNFULFILLED' ? (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                          firebase
                            .database()
                            .ref('orders/' + selectOrder.id)
                            .update({
                              status: 'REQUEST_FOR_CANCEL',
                            })
                            .then(() => {
                              setShowOrder(false);
                              setSelectOrder(null);
                              setSelectProducts([]);
                              setOrders([]),
                                setLoadingOrders(true),
                                refreshOrders(),
                                setRefreshing(true);
                            });
                        }}>
                        <Text style={styles.buttonTitle}>
                          Request for Cancellation
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              )}
            </Modal>
          </>
        ) : null}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRow: {
    margin: -0,
    padding: 10,
    backgroundColor: '#FFF',
    width: '90%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#8f0611',
    marginLeft: 10,
    marginRight: 30,
    height: 50,
    borderRadius: 5,
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

export default OrdersList;

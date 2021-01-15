import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {firebase} from '../../components/firebase';
import {Modal, Button} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import {TouchableOpacity} from 'react-native-gesture-handler';
import OrderItem from './OrderItem';

const OrdersList = ({navigation, route}) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFlatList, setShowFlatList] = useState(false);

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
    if (orders.length > 0) {
      console.log('FIND THIS!');
      console.log(orders.length);
    }
  }, [orders]);

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
          <FlatList
            data={orders}
            extraData={loadingOrders || refreshing}
            renderItem={({item}) => {
              console.log('ITEM FOUND');
              console.log(item);
              return <OrderItem orderItem={item} key={item.id} />;
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
        ) : null}
        <Text>Hello</Text>
      </View>
    );
  }
};

export default OrdersList;

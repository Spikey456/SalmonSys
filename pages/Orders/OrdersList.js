import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {firebase} from '../../components/firebase';
import {Modal, Button} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import {TouchableOpacity} from 'react-native-gesture-handler';

const OrdersList = ({navigation, route}) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const refreshOrders = () => {
    setLoadingOrders(true)
    let array = [];
    firebase
      .database()
      .ref('orders')
      .once('value')
      .then((snap) => {
        let field = snap.val();

        console.log('Returning orderss');
        for (const [key, value] of Object.entries(field)) {
          if (value.user.id === route.params.user.uid) {
            value.id = key;
            array.push(value);
          }
        }
        setOrders(array);
        setLoadingOrders(false)
        console.log('Array set!');
        //console.log(snap.val());
      });
  };

  useEffect(() => {
    if (orders.length === 0) {
      refreshOrders();
    }
  });

  useEffect(() => {
    if (orders.length > 0) {
      console.log(orders);
    }
  }, [orders]);

  return (
    <View>
      <FlatList
        data={orders}
        extraData={loadingOrders}
        renderItem={({item}) => {
          //console.log('ITEM!');

          console.log(item);
          return item.map((order) => {
            console.log(order)

            /*<Card style={styles.cardRow} key={product.id}>
                  <Card.Content>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Image
                        source={{
                          uri: product.image ? product.image : imgDefault,
                        }}
                        style={{width: 120, height: 120, borderRadius: 10}}
                      />
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'space-around',
                        }}>
                        <Title>{product.name}</Title>
                        <Title style={{color: '#ff7334'}}>
                          PHP
                          {route.params.user.user.role ===
                          '-MM7epSByKyZ4VVVPBYK' // is Reseller
                            ? product.resellerPrice
                            : product.wholeSalePrice}
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
                      <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonTitle}>Add to Cart</Text>
                      </TouchableOpacity>
                      <InputSpinner
                        max={10}
                        min={2}
                        step={2}
                        colorMax={'#f04048'}
                        colorMin={'#40c5f4'}
                        value={this.state.number}
                        onChange={(num) => {
                          setQuantity(num);
                        }}
                      />
                    </View>
                  </Card.Actions>
                </Card>*/
          });
        }}
        keyExtractor={(item) => {
          return item.id;
        }}
        refreshing={loadingOrders}
        onRefresh={() => {
          setOrders([]), setLoadingOrders(true), refreshOrders();
        }}
      />
    </View>
  );
};

export default OrdersList;

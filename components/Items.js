/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import InputSpinner from 'react-native-input-spinner';
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

const Items = ({product, user, setLoadingProducts}) => {
  const [quantity, setQuantity] = useState(1);
  const imgDefault =
    'https://img2.pngio.com/documentation-screenshotlayer-api-default-png-250_250.png';

  const addToCart = () => {
    if (quantity > 0) {
      setLoadingProducts(true);
      let cart = {};
      let products = {};
      //let subtotal = {};
      cart[product.id] = product;
      cart[product.id].quantity = quantity;
      console.log(cart);
      firebase
        .database()
        .ref(`customers/${user.uid}/cart`)
        .child(product.id)
        .set({
          product,
          quantity: quantity,
        })
        .then(() => {
          products[product.id] = product;
          let subtotals = {};
          subtotals.subtotalReseller = product.resellerPrice * quantity;
          subtotals.subtotalWholeSaler = product.wholeSalePrice * quantity;
          subtotals.subtotalShopPrice = product.shopPrice * quantity;
          firebase
            .database()
            .ref(`customers/${user.uid}/checkout/products`)
            .child(product.id)
            .set({
              product,
              subtotals,
            })
            .then(() => {
              //console.log('Added to cart');
              firebase
                .database()
                .ref(`customers/${user.uid}/checkout/products`)
                .once('value')
                .then((snap) => {
                  let subtotals = {};
                  let fields = snap.val();
                  subtotals.subtotalReseller = 0;
                  subtotals.subtotalWholeSaler = 0;
                  subtotals.subtotalShopPrice = 0;
                  console.log(snap.val());
                  for (const [key, value] of Object.entries(snap.val())) {
                    
                    subtotals.subtotalReseller =
                      Number(value.subtotals.subtotalReseller) +
                      subtotals.subtotalReseller;
                    subtotals.subtotalWholeSaler =
                      Number(value.subtotals.subtotalWholeSaler) +
                      subtotals.subtotalWholeSaler;
                    subtotals.subtotalShopPrice =
                      Number(value.subtotals.subtotalShopPrice) +
                      subtotals.subtotalShopPrice;
                  }
                  console.log('ESTIMATED');
                  console.log(subtotals);
                  firebase
                    .database()
                    .ref(`customers/${user.uid}/checkout`)
                    .set({
                      products: fields,
                      subtotals: subtotals,
                    })
                    .then(() => {
                      console.log('Added to Cart');
                      setLoadingProducts(false);
                    })
                    .catch((err) => {
                      console.log('there is an Error: ' + err);
                    });
                });
            });
        })
        .catch((err) => {
          console.log(err);
        });
      //console.log('Added to cart');
    }
  };

  return (
    <Card style={styles.cardRow} key={product.id}>
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
            style={{
              width: 120,
              height: 120,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F44336',
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Title>{product.name}</Title>
            <Text>Stocks: {product.stocks}</Text>
            <Title style={{color: '#ff7334'}}>
              PHP
              {user.user.role === '-MM7epSByKyZ4VVVPBYK' // is Reseller
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              addToCart();
            }}>
            <Text style={styles.buttonTitle}>Add to Cart</Text>
          </TouchableOpacity>
          <InputSpinner
            max={product.stocks}
            min={0}
            step={0.5}
            colorMax={'#f04048'}
            colorMin={'#40c5f4'}
            value={quantity}
            rounded={false}
            showBorder
            onChange={(num) => {
              setQuantity(num);
            }}
          />
        </View>
      </Card.Actions>
    </Card>
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

export default Items;

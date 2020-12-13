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

const CheckoutItems = ({cartItem, user}) => {
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [price, setPrice] = useState(
    user.user.role === '-MM7epSByKyZ4VVVPBYK' // is Reseller
      ? cartItem.quantity >= 15
        ? cartItem.product.resellerPrice
        : cartItem.product.shopPrice
      : cartItem.quantity >= 30
      ? cartItem.product.wholeSalePrice
      : cartItem.product.resellerPrice,
  );
  const [priceType, setPriceType] = useState(
    user.user.role === '-MM7epSByKyZ4VVVPBYK' // is Reseller
      ? cartItem.quantity >= 15
        ? 'Reseller Price'
        : 'Shop Price'
      : cartItem.quantity >= 30
      ? 'Wholesale Price'
      : 'Reseller Price',
  );
  const imgDefault =
    'https://img2.pngio.com/documentation-screenshotlayer-api-default-png-250_250.png';

  const identifyUserType = (type, quantity) => {
    console.log('Updating price');
    if (type === 'USER') {
      if (user.user.role === '-MM7epSByKyZ4VVVPBYK') {
        if (quantity > 14) {
          console.log('Setting to Reseller Price');
          return 'Reseller Price';
        } else {
          console.log('Setting to Shop Price');
          return 'Shop Price';
        }
      } else {
        if (quantity >= 30) {
          console.log('Setting to Wholesale Price');
          return 'Wholesale Price';
        } else {
          console.log('Setting to Reseller Price');
          return 'Reseller Price';
        }
      }
    } else {
      if (user.user.role === '-MM7epSByKyZ4VVVPBYK') {
        if (quantity >= 15) {
          return cartItem.product.resellerPrice;
        } else {
          return cartItem.product.shopPrice;
        }
      } else {
        if (quantity >= 30) {
          return cartItem.product.wholeSalePrice;
        } else {
          return cartItem.product.resellerPrice;
        }
      }
    }
  };

  

  useEffect(() => {
    console.log(priceType);
  }, [priceType]);
  /*return (
    <Card style={styles.cardRow} key={cartItem.product.id}>
      <Card.Content>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Image
            source={{
              uri: cartItem.product.image ? cartItem.product.image : imgDefault,
            }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F44336',
            }}
          />
          <Title>{cartItem.product.name}</Title>
        </View>
      </Card.Content>
      <Card.Actions>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('Remove');
          }}>
          <Text style={styles.buttonTitle}>Remove</Text>
        </TouchableOpacity>
      </Card.Actions>
    </Card>
  );*/

  return (
    <Card style={styles.cardRow} key={cartItem.product.id}>
      <Card.Content>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Image
            source={{
              uri: cartItem.product.image ? cartItem.product.image : imgDefault,
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
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Title>{cartItem.product.name}</Title>
            <Title>x{cartItem.product.quantity}</Title>
            
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Title style={{color: '#ff7334'}}>
              PHP
              {price}
            </Title>
            <Text>{priceType}</Text>
          </View>
        </View>
      </Card.Content>
      
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

export default CheckoutItems;

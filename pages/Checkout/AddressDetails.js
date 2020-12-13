/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Card, Title} from 'react-native-paper';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {firebase} from '../../components/firebase';
import Spinner from 'react-native-loading-spinner-overlay';

const AddressDetails = ({navigation, route}) => {
  const [userCheckout, setUserCheckout] = useState(null);
  const [loadingCheckout, setLoadingCheckout] = useState(true);
  const [address, setAddress] = useState(
    route.params.user.user.checkout.address
      ? route.params.user.user.checkout.address
      : '',
  );
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

  const saveAddress = () => {
    firebase
      .database()
      .ref(`customers/${route.params.user.uid}/checkout`)
      .update({address: address})
      .then(() => {
        console.log('Address set!');

        navigation.navigate('Finalize Checkout');
      });
  };

  useEffect(() => {
    if (userCheckout !== null) {
      setLoadingCheckout(false);
    }
    console.log(route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK');
    console.log(userCheckout);
  }, [userCheckout]);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Spinner
        visible={loadingCheckout}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
      <Card>
        <Card.Content>
          <Title>Full Address</Title>
          <TextInput
            multiline={true}
            numberOfLines={4}
            style={{
              marginTop: 10,
              marginBottom: 10,
              height: 80,
              borderColor: 'gray',
              borderWidth: 1,
              textAlignVertical: 'top',
            }}
            placeholder={'Input Full Address...'}
            onChangeText={(text) => setAddress({text})}
            value={address}
          />
          <Text>
            *Note: an additional PHP1,000 will be added to the checkout total
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: route.params.user.user.checkout.address
                ? '#A9A9A9'
                : '#ff7334',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 20,
              height: 40,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            disabled={address === route.params.user.user.checkout.address}
            onPress={saveAddress}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                paddingLeft: 10,
                paddingRight: 10,
                fontWeight: 'bold',
              }}>
              Save
            </Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </View>
  );
};

export default AddressDetails;

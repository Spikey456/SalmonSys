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
import {firebase} from '../../components/firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

const PickupDate = ({navigation, route}) => {
  const [userCheckout, setUserCheckout] = useState(null);
  const [loadingCheckout, setLoadingCheckout] = useState(true);
  const [date, setDate] = useState(
    route.params.user.user.checkout.pickupDate
      ? route.params.user.user.checkout.pickupDate
      : moment().format('YYYY-MM-DD'),
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

  const savePickupDate = () => {
    firebase
      .database()
      .ref(`customers/${route.params.user.uid}/checkout`)
      .update({pickupDate: date})
      .then(() => {
        console.log('Pickup date set!');
        if (route.params.user.user.role === '-MM7epSByKyZ4VVVPBYK') {
          navigation.navigate('Checkout(Address)');
        } else {
          navigation.navigate('Checkout(Address)');
        }
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
          <DatePicker
            style={{width: 'auto'}}
            date={date}
            mode="date"
            placeholder="Select Date"
            format="YYYY-MM-DD"
            minDate={moment().format('YYYY-MM-DD')}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            /*customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 60,
              },
              dateInput: {
                marginLeft: 0,
              },
              // ... You can check the source to find the other keys.
            }}*/
            onDateChange={(date) => {
              setDate(date);
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor:
                date !== moment().format('YYYY-MM-DD') ? '#ff7334' : '#A9A9A9',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 20,
              height: 40,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            disabled={date === moment().format('YYYY-MM-DD')}
            onPress={savePickupDate}>
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

export default PickupDate;

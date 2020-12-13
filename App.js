/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import {firebase} from './components/firebase';
import Header from './components/Header';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import Spinner from 'react-native-loading-spinner-overlay';

import Home from './pages/Home';
import AddressDetails from './pages/Checkout/AddressDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout/Checkout';
import PickupDate from './pages/Checkout/PickupDate';
import LoginScreen from './pages/LoginScreen/LoginScreen';
import Products from './pages/Products';
import ProductPage from './pages/ProductPage';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setLoading(true);
    firebase.auth().onAuthStateChanged((response) => {
      if (response) {
        console.log(response);
        const uid = response.uid;
        const usersRef = firebase.database().ref('customers/' + uid);
        usersRef
          .once('value')
          .then((querySnap) => {
            if (!querySnap) {
              alert('User does not exist anymore.');
              return;
            }
            const user = querySnap.val();
            //console.log(user);
            setUser({user, uid});
            setLoading(false);
            //navigation.navigate('Home');
          })
          .catch((error) => {
            alert(error);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      let array = [];
      for (const [key, value] of Object.entries(user.user.cart)) {
        array.push(value);
      }
      setCart(array);
    }
  }, [user]);

  const createCheckoutStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        initialParams={{user, cart, loading, setLoading}}
        component={Cart}
      />
      <Stack.Screen
        name="Checkout(Pickup Date)"
        initialParams={{user, loading, setLoading}}
        component={PickupDate}
      />
      <Stack.Screen
        name="Checkout(Address)"
        initialParams={{user, loading, setLoading}}
        component={AddressDetails}
      />
      <Stack.Screen
        name="Finalize Checkout"
        initialParams={{user, loading, setLoading}}
        component={Checkout}
      />
    </Stack.Navigator>
  );

  const createProductStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        initialParams={{user, loading, setLoading}}
        component={Products}
      />
      <Stack.Screen name="Product Page" component={ProductPage} />
    </Stack.Navigator>
  );

  if (loading) {
    return (
      <>
        <View style={{flex: 1}}>
          <Text>Loading</Text>
        </View>
      </>
    );
  } else {
    return (
      <>
        <NavigationContainer>
          {user ? (
            <Drawer.Navigator initialRouteName="Login">
              <Drawer.Screen
                name="Home"
                options={{
                  drawerIcon: ({focused, size}) => (
                    <Image
                      source={require('./assets/home.png')}
                      style={{height: size, width: size}}
                    />
                  ),
                }}
                initialParams={{user, loading, setLoading}}
                component={Home}
              />
              <Drawer.Screen
                name="Products"
                options={{
                  drawerIcon: ({focused, size}) => (
                    <Image
                      source={require('./assets/fish.png')}
                      style={{height: size, width: size}}
                    />
                  ),
                }}
                children={createProductStack}
              />
              <Drawer.Screen
                name="Cart"
                options={{
                  drawerIcon: ({focused, size}) => (
                    <Image
                      source={require('./assets/cart.png')}
                      style={{height: size, width: size}}
                    />
                  ),
                }}
                component={createCheckoutStack}
              />
            </Drawer.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                initialParams={{setUser, user, loading, setLoading}}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </>
    );
  }
}

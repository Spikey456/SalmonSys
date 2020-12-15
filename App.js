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
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import Spinner from 'react-native-loading-spinner-overlay';

import Home from './pages/Home';
import About from './pages/About';
import AddressDetails from './pages/Checkout/AddressDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout/Checkout';
import PickupDate from './pages/Checkout/PickupDate';
import OrdersList from './pages/Orders/OrdersList';
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
      if (user.user.cart) {
        for (const [key, value] of Object.entries(user.user.cart)) {
          array.push(value);
        }
        setCart(array);
      }
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

  const logOutUser = () => {
    setLoading(true);
    firebase
      .auth()
      .signOut()
      .then(function () {
        console.log('Logging out...');
        setLoading(false);
        setUser(null);
      })
      .catch(function (error) {
        // An error happened.
      });
  };

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
          <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={{color: '#FFF'}}
          />
        </View>
      </>
    );
  } else {
    return (
      <>
        <NavigationContainer>
          {user ? (
            <>
              <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{color: '#FFF'}}
              />
              <Drawer.Navigator
                initialRouteName="Login"
                drawerContent={(props) => {
                  return (
                    <DrawerContentScrollView {...props}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 15,
                        }}>
                        <Image
                          style={{
                            height: 120,
                            width: 90,
                            alignSelf: 'center',
                            justifyContent: 'flex-start',
                          }}
                          source={require('./assets/icon.png')}
                        />
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'black',
                          }}>
                          {user.user.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#ff7334',
                          }}>
                          {user.user.role === '-MM7epSByKyZ4VVVPBYK'
                            ? 'Reseller'
                            : 'Wholesaler'}
                        </Text>
                      </View>
                      <DrawerItemList {...props} />
                      <DrawerItem
                        label="Logout"
                        icon={({focused, size}) => (
                          <Image
                            source={require('./assets/logout.png')}
                            style={{height: size, width: size}}
                          />
                        )}
                        onPress={logOutUser}
                      />
                    </DrawerContentScrollView>
                  );
                }}>
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
                  children={createCheckoutStack}
                />
                <Drawer.Screen
                  name="Orders"
                  options={{
                    drawerIcon: ({focused, size}) => (
                      <Image
                        source={require('./assets/orders.png')}
                        style={{height: size, width: size}}
                      />
                    ),
                  }}
                  initialParams={{user}}
                  children={OrdersList}
                />
                <Drawer.Screen
                  name="About"
                  options={{
                    drawerIcon: ({focused, size}) => (
                      <Image
                        source={require('./assets/about.png')}
                        style={{height: size, width: size}}
                      />
                    ),
                  }}
                  component={About}
                />
              </Drawer.Navigator>
            </>
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

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
import {View, Text} from 'react-native';
import {firebase} from './components/firebase';
import Header from './components/Header';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './pages/Home';
import Cart from './pages/Cart';
import LoginScreen from './pages/LoginScreen/LoginScreen';
import Products from './pages/Products';
import ProductPage from './pages/ProductPage';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
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
            //navigation.navigate('Home');
          })
          .catch((error) => {
            alert(error);
          });
      } else {
        setLoading(true);
      }
    });
  }, []);

  const createProductStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Products"
        initialParams={{user}}
        component={Products}
      />
      <Stack.Screen name="Product Page" component={ProductPage} />
    </Stack.Navigator>
  );

  if (loading) {
    return (
      <>
        <View style={{alignItems: 'center', flex: 1}}>
          <Text>Loading...</Text>
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
                initialParams={{user}}
                component={Home}
              />
              <Drawer.Screen name="Products" children={createProductStack} />
              <Drawer.Screen
                name="Cart"
                initialParams={{user}}
                component={Cart}
              />
            </Drawer.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                initialParams={{setUser, user}}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </>
    );
  }
}

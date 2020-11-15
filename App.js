/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';

import Header from './components/Header';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductPage from './pages/ProductPage';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    const createProductStack = () => (
      <Stack.Navigator>
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen name="Product Page" component={ProductPage} />
      </Stack.Navigator>
    );
    return (
      <>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Products" children={createProductStack} />
          </Drawer.Navigator>
        </NavigationContainer>
      </>
    );
  }
}

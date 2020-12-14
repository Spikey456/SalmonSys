/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Modal, Button} from 'react-native-paper';
import {firebase} from '../components/firebase';
import Items from '../components/Items';
import Spinner from 'react-native-loading-spinner-overlay';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Products = ({navigation, route}) => {
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [] = useState(0);

  const loadProducts = () => {
    setProducts([]);
    let array = [];
    setTimeout(function () {
      firebase
        .database()
        .ref('products')
        .once('value')
        .then((snap) => {
          //console.log(snap.val());
          for (const [key, value] of Object.entries(snap.val())) {
            value.id = key;
            //console.log(value);
            array.push(value);
          }
          // console.log(array);
          setProducts([array]);
          setRefreshing(false);
          //console.log(products);
          //console.log('Array set!');
        });
    }, 1000);

    //console.log('Firebase Exit');
  };

  useEffect(() => {
    if (products.length === 0) {
      setLoadingProducts(true);
      loadProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      //console.log(products);
      setTimeout(function () {
        setLoadingProducts(false);
      }, 500);
    }
  }, [products]);

  /*<Text>Products</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Product Page')}>
          <Text style={styles.btnText}> Go to Product Page</Text>
        </TouchableOpacity> */
  return (
    <>
      <View>
        <Spinner
          visible={loadingProducts}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
        {!loadingProducts && products.length !== 0 && (
          <FlatList
            data={products}
            extraData={!loadingProducts || refreshing}
            renderItem={({item}) => {
              //console.log('ITEM!');

              //console.log(item);
              return item.map((product) => {
                console.log(product.name);
                return product.isPublished ? (
                  <Items
                    key={product.id}
                    product={product}
                    setShowModal={setShowModal}
                    setLoadingProducts={setLoadingProducts}
                    user={route.params.user}
                  />
                ) : null;

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
            refreshing={refreshing}
            onRefresh={() => {
              setProducts([]), setLoadingProducts(true), loadProducts();
            }}
          />
        )}
        {/**
        <Button
          onPress={() => {
            setShowModal(true);
          }}>
          <Text>Test</Text>
        </Button>
        <Button
          onPress={() => {
            navigation.navigate('Cart');
            console.log('Go to cart');
          }}>
          View Cart
        </Button>
        */}
      </View>

      <Modal
        visible={showModal}
        onDismiss={() => {
          setShowModal(false);
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 300,
              backgroundColor: '#fff',
              height: 200,
              borderRadius: 20,
            }}>
            <View
              style={{
                marginTop: 20,
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  padding: 15,
                  color: '#000',
                }}>
                Added to cart successfully!
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#ff7334',
                  height: 50,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  navigation.navigate('Cart');
                  console.log('Go to cart');
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontWeight: 'bold',
                  }}>
                  View Cart
                </Text>
              </TouchableOpacity>
              <Button
                onPress={() => {
                  setShowModal(false);
                }}>
                Close
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Products;

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
import {firebase} from '../components/firebase';
import Items from '../components/Items';

const Products = ({route}) => {
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [] = useState(0);

  const loadProducts = () => {
    setProducts([]);
    let array = [];
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
        setProducts([...products, array]);
        //console.log(products);
        //console.log('Array set!');
      });
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
  if (loadingProducts) {
    return (
      <>
        <Text>Loading....</Text>
      </>
    );
  } else {
    /*<Text>Products</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Product Page')}>
          <Text style={styles.btnText}> Go to Product Page</Text>
        </TouchableOpacity> */
    return (
      <View>
        <FlatList
          data={products}
          extraData={!loadingProducts}
          renderItem={({item}) => {
            //console.log('ITEM!');

            //console.log(item);
            return item.map((product) => {
              console.log(product.name);
              return product.isPublished ? (
                <Items product={product} user={route.params.user} />
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
        />
      </View>
    );
  }
};

export default Products;

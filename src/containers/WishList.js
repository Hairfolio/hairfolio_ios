import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { StatusBar, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NavigatorStyles from '../common/NavigatorStyles';
import BlackHeader from '../components/BlackHeader';
import { windowWidth, windowHeight, ActivityIndicator } from '../helpers';
import { COLORS, FONTS, h, SCALE } from '../style';
import WishListStore from '../mobx/stores/hfStore/WishListStore';
import ProductStore from '../mobx/stores/hfStore/ProductStore';

@observer
export default class WishList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      productList: null,
    };
  }

  gotoCartScreen() {
    this.props.navigator.push({
      screen: 'hairfolio.CartList',
      navigatorStyle: NavigatorStyles.tab,
    });
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content');
    await WishListStore.load().then((success) => {
      setTimeout(() => {
        this.setState({ productList: WishListStore.dataSource._dataBlob.s1 });
      }, 1500);
    })
  }

  componentWillUnmount(){
    StatusBar.setBarStyle('dark-content')
  }

  async removeFromWishlist(item, index) {
    let wishListStore = WishListStore;
    await wishListStore.removeProductFromWishList(item.product.id).then((result) => {
      if (result.status == "201") {
        var temp = result.favourite.product;
        var arr = this.state.productList;
        arr[index].product = temp;
        var arr_temp = arr;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].product.is_favourite == false) {
            arr_temp.splice(i, 1);
            break;
          }
        }
        this.setState({ productList: arr_temp });
        // CategoryStore.load();
      }
    });
  }

  render() {
    let wishListStore = WishListStore;
    let placeholder_icon = require('img/medium_placeholder_icon.png');
    if (wishListStore.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return (
      <View style={styles.wrapper}>
        <BlackHeader
          onLeft={() => {
            this.props.navigator.pop({ animated: true })
            StatusBar.setBarStyle('dark-content')
        }}
          title='My Wish List' />
        <KeyboardAwareScrollView>
          <View style={styles.mainContainer}>

            {(this.state.productList == 0)
              ?
              (<View style={{ flex: 1 }}>
                <Text
                  style={{
                    paddingTop: h(38),
                    fontSize: h(34),
                    textAlign: 'center',
                    fontFamily: FONTS.BOOK_OBLIQUE
                  }}
                >
                  No products in wishlist yet.
          </Text>
              </View>)
              :
              <View>
                <FlatList
                  data={this.state.productList}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  keyExtractore={(item, index) => item.id}
                  renderItem={({ item, index }) =>
                    <View
                      style={{
                        margin: 5,
                        marginTop: 7,
                        width: (windowWidth / 2) - 20,
                        height: (windowHeight / 2) - 80,
                      }}>
                      <TouchableOpacity
                        style={{
                          borderRadius: 5,
                          width: (windowWidth / 2) - 20,
                          height: (windowHeight / 2) - 150,
                          alignItems: 'center',
                          elevation: 1,
                          shadowOpacity: 0.10,
                          // shadowRadius: 0.8,
                          shadowOffset: {
                            height: 1.2,
                            width: 1.2
                          }
                        }} onPress={() => {

                          

                          this.props.navigator.push({
                            screen: 'hairfolio.ProductDetail',
                            navigatorStyle: NavigatorStyles.tab,
                            passProps: {
                              prod_id: item.product.id,
                              isFrom:"wishList"
                            }
                          });
                        }}>
                        <Image
                          defaultSource={placeholder_icon}
                          source={(item.product.product_thumb) ? { uri: item.product.product_thumb } : placeholder_icon}
                          onError={() => {item.product.product_thumb = item.product.product_image}}
                          // source={{ uri: "AppIcon" }}
                          style={{
                            flex: 1,
                            width: (windowWidth / 2) - 30,
                            height: (windowHeight / 2) - 150,
                            resizeMode: 'contain',
                          }} />
                        {/* star_fill_icon */}
                        <TouchableOpacity
                          style={{
                            position: 'absolute',
                            top: 7,
                            right: 7,
                          }}
                          onPress={() => { this.removeFromWishlist(item, index) }
                          }>
                          <Image
                            style={{
                              position: 'absolute',
                              top: 7,
                              right: 7,
                            }}
                            source={(item.product.is_favourite) ? require('img/star_fill_icon.png') : require('img/star_border_icon.png')} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                      <Text
                        numberOfLines={1}
                        style={{
                          marginTop: 3,
                          color: COLORS.DARK,
                          fontFamily: FONTS.LIGHT,
                          fontSize: SCALE.h(30)
                        }}>{item.product.name}</Text>


                      {(item.product.discount_percentage != null) ? 

                        <View style={{flexDirection:'column'}}>

                        <View style={{flexDirection:'row'}}>
                         <Text
                              style={{
                               color: COLORS.GRAY2,
                               fontFamily: FONTS.MEDIUM,
                              fontSize: SCALE.h(30),
                              textDecorationLine:'line-through'
                              }}>{(item.product.price) ? ("$" + item.product.price) : "$0.0"}</Text>
                          <Text style={{
                               color: COLORS.DISCOUNT_RED,
                               fontFamily: FONTS.MEDIUM,
                              fontSize: SCALE.h(30)}}>  ${item.product.final_price}</Text>
                          </View>
                          <Text style={{
                               color: COLORS.DISCOUNT_RED,
                               fontFamily: FONTS.MEDIUM,
                              fontSize: SCALE.h(30)}}>{item.product.discount_percentage}% off</Text>
                          </View>    
                          
                          :
                          <Text
                              style={{
                               color: COLORS.BLACK,
                               fontFamily: FONTS.MEDIUM,
                              fontSize: SCALE.h(30)
                              }}>{(item.product.price) ? ("$" + item.product.final_price) : "$0.0"}</Text>
                          }
                     
                    </View>

                  }
                />

              </View>
            }
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  mainContainer: {
    padding: 15,
    flex: 1,
    // backgroundColor:'red'
  },
  productImage: {
    borderRadius: 5,
    height: h(220),
    width: h(220),
  },
  imageWrapper: {
    height: h(220),
    width: h(220),
    borderRadius: 5,
    justifyContent: 'center',
    elevation: 1,
    shadowOpacity: 0.10,
    shadowOffset: {
      height: 1.2,
      width: 1.2
    }
  },
  imgWrap: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  qtyImg: {
    width: 10,
    height: 10,
    resizeMode: "contain",
    padding: 5,
  },
  outline: {
    width: 15,
    height: 15,
    borderRadius: 7,
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  labelText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    padding: 5
  },
  rowDirectionWrapper: {
    flexDirection: 'row'
  },
  productDesc: {
    flex: 1,
    padding: 15
  },
  labelProductTitleText: {
    fontSize: SCALE.h(27),
    fontFamily: FONTS.MEDIUM,
    // color: COLORS.DARK
  },
  labelTextLight: {
    fontSize: SCALE.h(22),
    fontFamily: FONTS.ROMAN,
    color: COLORS.SEARCH_LIST_ITEM_COLOR
  },
  categoryTitle: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.LIGHT,
    // color: COLORS.SEARCH_LIST_ITEM_COLOR
  },
  priceLabelText: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.MEDIUM,
    // color: COLORS.SEARCH_LIST_ITEM_COLOR
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  btnText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    color: COLORS.LIGHT
  },
});

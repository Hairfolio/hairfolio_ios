import { observer } from "mobx-react";
import React, { Component } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";
import NavigatorStyles from "../common/NavigatorStyles";
import BlackHeader from "../components/BlackHeader";
import { showLog, windowWidth, showAlert } from "../helpers";
import CartStore from "../mobx/stores/hfStore/CartStore";
import ProductStore from "../mobx/stores/hfStore/ProductStore";
import { COLORS, FONTS, h, SCALE } from "../style";
import CartCounterView from "../components/CartCounterView";
import ProductListing from "../components/Product/ProductListing";
import RelatedProductListing from "../components/Product/RelatedProductListing";
import WishListStore from "../mobx/stores/hfStore/WishListStore";
import ProductTagStore from "../mobx/stores/ProductTagStore";
import RelatedProductStore from '../mobx/stores/hfStore/RelatedProductStore';
import NewArrivalStore from '../mobx/stores/hfStore/NewArrivalStore';
import TrendingStore from '../mobx/stores/hfStore/TrendingStore';
import SalesStore from '../mobx/stores/hfStore/SalesStore';


var priorState;

@observer
export default class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
      
    };

    // priorState=this.prop

  }

  async componentDidMount() {

    ProductStore.uniqueCode = this.props.uniqueCode;
    // ProductStore.load(this.props.prod_id);
    if (this.props.isFromFeed) {
      this.loadProductFromFeed()
    }
    else {
      this.loadProduct()
    }

    // ProductStore.load("281");
  }

  componentWillUnmount(){
    ProductStore.popProduct()
    // ProductStore.setCurrentProduct()
  }

  async loadProduct() {
    let getPro = await ProductStore.getProdDetail(this.props.prod_id);
  }

  async loadProductFromFeed() {
    ProductStore.isLoading = true
    let getPro = await ProductStore.getProdDetail(this.props.prod_id);
    ProductStore.isLoading = false
  }
    

  async onStarClick(data, index) {

    showLog("PRODUCT DETAIL COMPONENT ==> " + JSON.stringify(data))
    // showLog("RELATED PRODUCT COMPONENT ==> "+JSON.stringify(data))

    data = ProductStore.productDetail;

    let wishListStore = WishListStore;

    if (data.is_favourite) {
      await wishListStore.removeProductFromWishList(data.id).then((result) => {
        if (result.status == "201") {
          ProductStore.productDetail.is_favourite = false;
          this.updateAllData(false,data)
        }
        // else {
        //   showAlert('Something went wrong!')
        // }
        // showLog("PRODUCT ARR Remove==> " + JSON.stringify(this.state.productArr))
      });
    } else {
      await wishListStore.addProductToWishList(data.id).then((result) => {
        if (result.status == "201") {
          ProductStore.productDetail.is_favourite = true;
          this.updateAllData(true,data)
        }
        // else {
        //   showAlert('Something went wrong!')
        // }
      });
    }
  }

  updateAllData(isFav,data)
  {
    // if (this.props.isFrom == "relatedProduct") {

      showLog("RELATED PRODUCT TAG STORE PRODUCTS ==> " + JSON.stringify(RelatedProductStore.relatedProducts))
      showLog("RELATED PRODUCT TAG STORE PRODUCTS 2 ==> " + JSON.stringify(data.id))
      RelatedProductStore.relatedProducts.filter((e,index) => {
       
        if (e.id == data.id) {
          // alert(JSON.stringify(e.is_favourite+"===>"+index))

          RelatedProductStore.relatedProducts[index].is_favourite = isFav
          
        }
      });

    // }
    // else {
      showLog("PRODUCT TAG STORE PRODUCTS ==> " + JSON.stringify(ProductTagStore.products))
      showLog("PRODUCT TAG STORE PRODUCTS 2 ==> " + JSON.stringify(data.id))


      ProductTagStore.products.filter((e,index) => {
       
        if (e.id == data.id) {
          // alert(JSON.stringify(e.is_favourite+"===>"+index))
          ProductTagStore.products[index].is_favourite = isFav
          ProductTagStore.isChanged = "y";
        }
      });

     

      NewArrivalStore.categories.filter((e,index) => {
       
        if (e.id == data.id) {
          NewArrivalStore.categories[index].is_favourite = isFav
        }
      });

      TrendingStore.trendingProducts.filter((e,index) => {
        if (e.id == data.id) {
          TrendingStore.trendingProducts[index].is_favourite = isFav
        }
      });

      SalesStore.salesProducts.filter((e,index) => {
        if (e.id == data.id) {
          SalesStore.salesProducts[index].is_favourite = isFav
        }
      });
      // ProductTagStore.isChanged = "y";
      // ProductTagStore.pr
    // }
  }


  render() {
    const placeholder_icon = require('img/medium_placeholder_icon.png');
    let store = ProductStore;

    // showLog("Product detail IN ==>"+JSON.stringify(store.prod_gallery.length))
    // if(store.prod_gallery.length >0){
    //   showLog("Product detail IN url==>"+store.prod_gallery[0].image_url)
    // }
    if (store.isLoading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <BlackHeader
          onLeft={() => {
            // ProductStore.popProduct()
            showLog("GO TO PREVIOUS")
            this.props.navigator.pop({ animated: true })
          }}
          title={this.props.categoryTitle ? this.props.categoryTitle : ""}
          onRenderRight={() => (
            
            <TouchableOpacity
              style={{marginRight:5}}
              onPress={() => {
                this.props.navigator.push({
                  screen: "hairfolio.CartList",
                  navigatorStyle: NavigatorStyles.tab
                });
              }}
            >
              <Image
                style={{
                  width: h(38),
                  height: h(38),
                  alignSelf: "flex-end",
                  marginRight: 15,
                  padding: 12
                }}
                source={require("img/cart_icon.png")}
              />
              <CartCounterView cartIconView={{marginRight:5,marginTop:-32}} numberOfBagItems = {CartStore.numberOfBagItems} />
            </TouchableOpacity>
          )}
        />
        <ScrollView>
          <View style={[styles.container, { padding: 10, paddingTop: 16 }]}>
            <View>
            <TouchableOpacity style={styles.starBig}
              onPress={()=>{
                this.onStarClick()
              }}
            >    
            <Image style={{height:22,width:22,alignSelf:'center'}}
            // style={styles.starBig}
                source={(store.productDetail.is_favourite) ? 
                                require('img/star_fill_icon.png') : 
                                  require('img/star_border_icon.png')}
                    />   
            </TouchableOpacity> 

              <Swiper
                style={styles.wrapper}
                paginationStyle={{bottom:0}}
                showsPagination={true}
                dot={<View style={styles.dot} />}
                activeDot={<View style={styles.activeDot} />}
                showsButtons={false}
                height={windowWidth}
              >

            
                {(store.prod_gallery.length>0) ?
                
                store.prod_gallery.map((value,index)=>{
                return(
                  <View style={styles.slide}>  
                  <Image
                  defaultSource={placeholder_icon}
                  style={styles.image}
                  source={(value.image_url) ? {uri:value.image_url} : placeholder_icon}
                  />
               </View>
                )
                })
                  :
                  <View style={styles.slide}> 
                    
                      <Image
                        style={styles.image}
                        defaultSource={placeholder_icon}
                       source={(store.productDetail.product_image) ? {uri:store.productDetail.product_image} : placeholder_icon}
                  >
                  <TouchableOpacity style={styles.starBig}
                      onPress={()=>{
                        this.onStarClick()
                      }}
                  >
                  <Image style={{height:22,width:22,alignSelf:'center'}}
                      source={(store.productDetail.is_favourite) ? 
                                require('img/star_fill_icon.png') : 
                                  require('img/star_border_icon.png')}
                    />    
                  </TouchableOpacity>  
                  
                  </Image>
              
                      
                  </View>
                }

              </Swiper>
            </View>

            <View>
              <View
                style={[styles.imgWrap, { paddingTop: 5, paddingBottom: 5 }]}
              >
              <View style={{width:windowWidth/1.8}}>
                <Text
                  style={[styles.labelText, { width: windowWidth / 1.5 + 10 }]}
                  ellipsizeMode="tail"
                  numberOfLines={2}
                >
                  {store.productDetail.name}
                </Text>
                <Text style={styles.subCategoryName}
                  numberOfLines={1}>
                {(store.productDetail.product_brand) ?
                     store.productDetail.product_brand.name:"" }
               </Text>
              </View>


                <View style={[styles.imgWrap, { alignItems: "center" }]}>                  
                  <TouchableOpacity style={(this.state.quantity > 0) ? 
                                          styles.outline : styles.outlineDisabled}
                                  disabled={(this.state.quantity >0) ?
                                           false : true }
                  onPress={() => {
                    if (this.state.quantity >= 1) {
                      let temp = this.state.quantity
                      if(store.productDetail.quantity >= temp) {
                        temp = temp - 1;
                        this.setState({ quantity : temp })
                      }
                    }
                  }}>
                    <Image
                      style={(this.state.quantity > 0) ? styles.qtyImg : styles.qtyImgDisabled}
                      source={require("img/subtrstion_icon.png")}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.labelText, {
                        paddingLeft: 5, paddingRight: 5,alignSelf:'center'
                      }
                    ]}
                  > {this.state.quantity}
                  </Text>
                 
                  <TouchableOpacity style={(store.productDetail.quantity > this.state.quantity) ?
                                            styles.outline : styles.outlineDisabled}
                    disabled={(store.productDetail.quantity > this.state.quantity) ? 
                                    false : true}
                  
                  onPress={
                  () => {
                    let temp = this.state.quantity
                    if(store.productDetail.quantity > temp) {
                      temp = temp + 1;
                      this.setState({ quantity : temp })
                    }
                   
                  }}>
                    <Image
                      style={(store.productDetail.quantity > this.state.quantity) ?
                                    styles.qtyImg : styles.qtyImgDisabled}
                      source={require("img/add_icon.png")}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[styles.imgWrap, { paddingTop: 5, paddingBottom: 5 }]}
              >

              {(store.productDetail.discount_percentage != null) ?     

              <View>
                <View style={{flexDirection:'row'}}>
                  <Text style={styles.priceLabelText}>
                    {store.productDetail.price
                      ? "$" + store.productDetail.price
                      : "$0.0"}
                  </Text>

                  <Text style={[styles.finalPriceLabelText,{marginLeft:10}]}>
                    {store.productDetail.final_price
                      ? "$" + store.productDetail.final_price
                      : "$0.0"}
                  </Text>    

                </View>
                <Text 
                    style={styles.finalPriceLabelText}
                    >{store.productDetail.discount_percentage}% off</Text>      

              </View>  
                :
                  <Text style={[styles.finalPriceLabelText , { color:COLORS.SEARCH_LIST_ITEM_COLOR }]}>
                    {store.productDetail.final_price
                      ? "$" + store.productDetail.final_price
                      : "$0.0"}
                  </Text>    
             
              }       
              </View>

              <View>
                <Text
                  style={[
                    styles.labelText,
                    { paddingTop: 5, paddingBottom: 5 }
                  ]}
                >
                  Description
                </Text>
                <Text style={styles.labelTextLight}>
                  {store.productDetail.description}
                </Text>
              </View>             

              <View>                
                <View
                  style={[styles.imgWrap, { paddingTop: 5, paddingBottom: 5 }]}
                >
                  
                </View>

                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={(store.productDetail.quantity > 0) ? false:true}
                  style={{
                    marginTop: 15,
                    backgroundColor:(store.productDetail.quantity > 0) ? COLORS.DARK : COLORS.LIGHT,
                    width: windowWidth - 60,
                    height: 35,
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center",
                    marginBottom:10,
                   
                  }}

                  onPress={() => {
                    showLog(
                      "ProductDetail ==>" +
                        JSON.stringify(store.productDetail)
                    );
                    let prod_id = store.productDetail.id;
                    CartStore.addToCart(prod_id,this.state.quantity,ProductStore.uniqueCode);
                  }}
                >
                  {(store.productDetail.quantity > 0) ?
                    <Text style={styles.btnText}>ADD TO CART</Text>
                    :
                    <Text style={styles.btnOutOfStockText}>OUT OF STOCK</Text>
                  }
                </TouchableOpacity>

                {store.productDetail.related_products ? 
                 <RelatedProductListing title={"Related Products"} product={store.productDetail.related_products} navigator={this.props.navigator}/>
                  :
              null
              }
               
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

 
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imgWrap: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  imgSmall: {
    height: 20,
    width: 20,
    resizeMode: "contain"
  },
  wrapper: {
  },
  slide1: {
    height: windowWidth,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BLUE4
  },
  slide2: {
    height: windowWidth,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BLUE4
  },
  slide: {
    width: windowWidth - 20,
    height: windowWidth,
    justifyContent: "center",
    alignItems: "center"
    // backgroundColor: COLORS.BLUE4
  },
  text: {
    color: COLORS.WHITE,
    fontSize: 30,
    fontWeight: "bold"
  },
  image: {
    width: windowWidth - 20,
    height: windowWidth,
    flex:1,
    resizeMode: "contain"
  },
  starBig: {
  
    height:30,
    width:30,
    position: 'absolute',
    top: 12,
    right: 15,
    zIndex:999999,
    
    
  },
  subCategoryName: {
    color: COLORS.DARK,
    fontFamily: FONTS.LIGHT,
    fontSize: h(24),
    paddingBottom: 5
  },
  dot: {
    backgroundColor: "rgba(255,255,255,0.3)",
    width: 6,
    height: 6,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  activeDot: {
    backgroundColor: COLORS.RED,
    width: 6,
    height: 6,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  labelText: {
    fontSize: SCALE.h(35),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK
  },
  labelTextPlus: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.MEDIUM,
    borderRadius: 8,
    borderColor: COLORS.GRAY,
    borderWidth: 0.5,
    padding: 1
  },
  labelTextLight: {
    fontSize: SCALE.h(25),
    fontFamily: FONTS.LIGHT,
    color: COLORS.BLACK
  },
  imgWrapInside: {
    flexDirection: "row"
  },
  rateImage: {
    width: 25,
    height: 20,
    resizeMode: "contain"
  },
  rateImageGray: {
    width: 23,
    height: 18,
    resizeMode: "contain"
  },
  priceLabelText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    color: COLORS.GRAY2,
    textDecorationLine:'line-through'
  },
  finalPriceLabelText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.ROMAN,
    color: COLORS.DISCOUNT_RED
  },
  cartImage: {
    width: 25,
    height: 25,
    resizeMode: "contain"
  },
  btnText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.LIGHT
  },
  btnOutOfStockText: {
    fontSize: SCALE.h(30),
    fontFamily: FONTS.MEDIUM,
    color: COLORS.BLACK
  },
  prodImg: {
    width: 150,
    height: 180
  },
  wrapProdView: {
    borderColor: COLORS.GRAY,
    borderRadius: 5,
    borderWidth: 0.5,
    marginLeft: 5,
    marginRight: 5
  },
  thumbBorder: {
    flex: 1,
    borderRadius: 5,
    alignItems: "center",
    elevation: 1,
    shadowOpacity: 0.1,
    shadowOffset: {
      height: 1.2,
      width: 1.2
    }
  },
  prodImg2: {
    flex: 1,
    resizeMode: "contain"
  },
  thumbWrapper: {
    position: "absolute",
    top: 7,
    right: 7
  },
  starImg: {
    position: "absolute",
    top: 7,
    right: 7
  },
  qtyImgDisabled: {
    width: 10,
    height: 10,
    resizeMode: "contain",
    padding: 5,
    tintColor: COLORS.GRAY2
  },
  qtyImg: {
    width: 10,
    height: 10,
    resizeMode: "contain",
    padding: 5
  },
  outline: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    
  },
  outlineDisabled: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    borderColor:COLORS.GRAY2
    
  },
  arrowRightImg: {
    width: 15,
    height: 10,
    resizeMode: "contain"
  }
});

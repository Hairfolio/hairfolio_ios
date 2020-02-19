import { FONTS, Image ,ScrollView, Text, TouchableOpacity, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import { observer } from "mobx-react";
import { ListView } from "react-native";
import React, { Component } from "react";
import { StyleSheet} from 'react-native';
import NavigatorStyles from '../../common/NavigatorStyles';
import { BASE_URL } from '../../constants';
import { COLORS, showAlert, ActivityIndicator } from '../../helpers';
import AllProductStore from '../../mobx/stores/hfStore/AllProductStore';
import ProductTagStore from '../../mobx/stores/ProductTagStore';
import CartStore from '../../mobx/stores/hfStore/CartStore';
import CategoryStore from '../../mobx/stores/hfStore/CategoryStore';
import WishListStore from '../../mobx/stores/hfStore/WishListStore';
import OrderStore from '../../mobx/stores/hfStore/OrderStore'
import { SCALE } from '../../style';

@observer
export default class Product extends Component{
  constructor(props) {
    super(props);
    this.state ={
      list: []
    }
  }

  componentDidMount() {
    let store = AllProductStore;
    this.setState({list: store.dataSource._dataBlob.s1});
    if(this.props.categoriesData){
      this.setState({list: this.props.categoriesData});
    }
    this.reloadProducts();
  }

  async onStarClick(data, index) {
    let wishListStore = WishListStore;
    if(data.is_favourite) {
      await wishListStore.removeProductFromWishList(data.id).then((result) => {
        if(result.status == "201"){
          this.reloadProducts();
        } 
        else {
          alert('Something went wrong!')
        }
      });
    } else {
      await wishListStore.addProductToWishList(data.id).then((result) => {
        if(result.status == "201") {
          this.reloadProducts();
        }
        else {
          alert('Something went wrong!')
        }
      });
    }
  }

  async reloadProducts() {
<<<<<<< HEAD
    let store = AllProductStore;
    await store.load().then((success) => {
      if(store.products.length != 0) {
        this.setState({
          list: store.dataSource._dataBlob.s1
        })
      }
    });
=======
    // let store = AllProductStore;
    // await store.load().then((success) => {;
    //   if(store.products.length != 0) {
    //     this.setState({
    //       list: store.dataSource._dataBlob.s1
    //     })
    //   }
    // });


    let store = ProductTagStore;
    store.loadMenu();

    store.getProductsList("", true,"","");

>>>>>>> 809c4cba406b2918782bfef26ca0e36bf251a5ac
  }

  renderRow(item) {
    return( 
      <View 
        style={{
          margin:5,
          marginTop:10,
          width:(windowWidth/2)-20,
          height:(windowHeight/2)-80,
          }}>
        <TouchableOpacity 
            style={{                                
              borderRadius: 5,
              width:(windowWidth/2)-20,
              height:(windowHeight/2)-150,
              alignItems:'center',
              elevation: 1,
              shadowOpacity: 0.10,
              // shadowRadius: 0.8,
              shadowOffset: {
                height: 1.2,
                width: 1.2
              } 
            }} onPress={ ()=> {
              this.props.navigator.push({
                screen: 'hairfolio.ProductDetail',
                navigatorStyle: NavigatorStyles.tab,
                passProps: {
                  prod_id: item.id,
                  categoryTitle: this.props.categoryTitle         
                }
              });
            }}>
          <Image               
            // source={(item.product_image) ? { uri: (BASE_URL + item.product_image)} : require('img/medium_placeholder_icon.png')}
            source={(item.product_image) ? { uri: item.product_image } : require('img/medium_placeholder_icon.png')}
            style={{
              flex:1,   
              width:(windowWidth/2)-30,  
              height:(windowHeight/2)-150,      
              resizeMode:'contain',

            }} />
            <TouchableOpacity 
              style={{
                position:'absolute',
                top:7,
                right:7,
              }}
              onPress={() => {this.onStarClick(item, index)}} >
                <Image 
                  style={{
                    position:'absolute',
                    top:7,
                    right:7,
                  }}
                  source={(item.is_favourite) ? require('img/star_fill_icon.png') : require('img/star_border_icon.png')}/>
              </TouchableOpacity>
          </TouchableOpacity>
        <Text 
          style={{                
            marginTop:7,
            color:COLORS.BLACK,
            fontFamily:FONTS.LIGHT,
            textAlign:'center',
            justifyContent: 'center',
            fontSize:SCALE.h(25)
          }} numberOfLines={2}>{item.name}</Text>

        <View 
          style={{
            flexDirection:'row',                
            justifyContent:'space-between',
            alignItems:'center',
            marginTop:3,
            width:(windowWidth/2)-25,
            position: 'absolute',
            bottom:0
          }}>
            <TouchableOpacity 
              onPress={()=>{ 
                let prod_id= item.id;
                CartStore.addToCart(prod_id,item.quantity);
                }}
              style={{
                backgroundColor:COLORS.DARK,
                paddingLeft:10,
                paddingRight:10,
                paddingTop:3,
                paddingBottom:3,
                marginLeft:5
              }}>
                <Text 
                  style={{
                    color:COLORS.WHITE,
                    fontFamily:FONTS.MEDIUM,
                    fontSize:SCALE.h(25)
                  }}>Add</Text>
            </TouchableOpacity>
            
            <Text
              style={{
                color:COLORS.BLACK,
                fontFamily:FONTS.ROMAN,
                fontSize:SCALE.h(27)
              }}>{(item.price) ? ("$"+item.price) : "$0.0"}</Text>
        </View>
      </View>
    )
  }

  render_old() {    
    let store = AllProductStore;
    return(
      <ScrollView>
      <View style={{flex:1,padding:10,backgroundColor:COLORS.WHITE,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
          {store.products.map((item,index)=>{
            return <View 
              style={{
                margin:5,
                marginTop:10,
                width:(windowWidth/2)-20,
                height:(windowHeight/2)-80,
                }}>
              <TouchableOpacity 
                  style={{                                
                    borderRadius: 5,
                    width:(windowWidth/2)-20,
                    height:(windowHeight/2)-150,
                    alignItems:'center',
                    elevation: 1,
                    shadowOpacity: 0.10,
                    // shadowRadius: 0.8,
                    shadowOffset: {
                      height: 1.2,
                      width: 1.2
                    } 
                  }} onPress={ ()=> {
                    this.props.navigator.push({
                      screen: 'hairfolio.ProductDetail',
                      navigatorStyle: NavigatorStyles.tab,
                      passProps: {
                        prod_id: item.id,
                        categoryTitle: this.props.categoryTitle         
                      }
                    });
                  }}>
                <Image               
                  // source={(item.product_image) ? { uri: (BASE_URL + item.product_image)} : require('img/medium_placeholder_icon.png')}
                  source={(item.product_image) ? { uri: item.product_image } : require('img/medium_placeholder_icon.png')}
                  style={{
                    flex:1,   
                    width:(windowWidth/2)-30,  
                    height:(windowHeight/2)-150,      
                    resizeMode:'contain',

                  }} />
                  <TouchableOpacity 
                    style={{
                      position:'absolute',
                      top:7,
                      right:7,
                    }}
                    onPress={() => {this.onStarClick(item, index)}} >
                      <Image 
                        style={{
                          position:'absolute',
                          top:7,
                          right:7,
                        }}
                        source={(item.is_favourite) ? require('img/star_fill_icon.png') : require('img/star_border_icon.png')}/>
                    </TouchableOpacity>
                </TouchableOpacity>


                
              <Text 
                style={{                
                  marginTop:7,
                  color:COLORS.BLACK,
                  fontFamily:FONTS.LIGHT,
                  textAlign:'center',
                  justifyContent: 'center',
                  fontSize:SCALE.h(25),
                }} numberOfLines={2}>{item.name}</Text>

              <View style={{marginTop:5, 
                            marginBottom:10, 
                            flexDirection:'row',
                            justifyContent:'space-between', 
                            alignItems:'center',
                            }}>

           
              {/* <View 
                style={{
                  flexDirection:'row',                
                  justifyContent:'space-between',
                  alignItems:'center',
                  marginTop:3,
                  width:(windowWidth/2)-25,
                  position: 'absolute',
                  bottom:0,
                  backgroundColor:'blue'
                }}> */}
                  <TouchableOpacity 
                    onPress={()=>{
                      let prod_id= item.id;
                      CartStore.addToCart(prod_id,item.quantity);
                      }}
                    style={{
                      backgroundColor:COLORS.DARK,
                      paddingLeft:10,
                      paddingRight:10,
                      paddingTop:3,
                      paddingBottom:3,
                      marginLeft:5
                    }}>
                      <Text 
                        style={{
                          color:COLORS.WHITE,
                          fontFamily:FONTS.MEDIUM,
                          fontSize:SCALE.h(25)
                        }}>Add</Text>
                  </TouchableOpacity>
                  
                  {(item.discount_percentage) ?
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={styles.priceLabel}>{(item.price) ? ("$" + item.price) : "$0.0"}</Text>

                      <Text
                        style={styles.finalPriceLabel}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
                    </View>
                    <Text
                      style={styles.finalPriceLabel}>{item.discount_percentage}% off</Text>
                  </View>
                  :
                  <Text
                    style={styles.finalPriceLabel}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
                }
              </View>

              {/* </View>   */}


            </View>
            })
          }
      </View>
      </ScrollView>
    )
  }
<<<<<<< HEAD

  render() {
    let store = AllProductStore;
    return(
     <ListView
        style={{flex:1}}
        contentContainerStyle={{padding:10,backgroundColor:COLORS.WHITE,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}
            bounces={false}
            enableEmptySections={true}
            dataSource={store.dataSource}
            renderRow={data => {
              return(this.renderRow(data)           
              )
            }}
            onEndReached={() => {
              store.loadNextPage();
            }}
            renderFooter={() => {
              if (store.nextPage != null && !this.isLoadingNextPage) {
                return (
                  <View
                    style={{
                      flex: 1,
                      paddingVertical: 20,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <ActivityIndicator size="large" />
                  </View>
                );
              } else {
                return <View />;
              }
        }}
      />
    )
  }
}
=======
}

const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
    padding:10,
    backgroundColor:COLORS.WHITE,
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between'
  },
  productImageView:{
    flex:1,   
    width:(windowWidth/2)-30,  
    height:(windowHeight/2)-150,      
    resizeMode:'contain',
  },
  imageClickView:{
    position:'absolute',
    top:7,
    right:7,
  },
  priceLabel:{
    color:COLORS.GRAY2,
    fontFamily:FONTS.ROMAN,
    fontSize:SCALE.h(27),
    textDecorationLine:'line-through'
  },
  finalPriceLabel:{
    color:COLORS.BLACK,
    fontFamily:FONTS.ROMAN,
    fontSize:SCALE.h(27),
    marginLeft:10
  }
  
  });
>>>>>>> 809c4cba406b2918782bfef26ca0e36bf251a5ac

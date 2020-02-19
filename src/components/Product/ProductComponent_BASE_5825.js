import { FONTS, Image, ScrollView, Text, TouchableOpacity, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import { observer } from "mobx-react";
import React, { Component } from "react";
import NavigatorStyles from '../../common/NavigatorStyles';
import { BASE_URL } from '../../constants';
import { COLORS, showLog, showAlert } from '../../helpers';
import AllProductStore from '../../mobx/stores/hfStore/AllProductStore';
import CartStore from '../../mobx/stores/hfStore/CartStore';
import CategoryStore from '../../mobx/stores/hfStore/CategoryStore';
import WishListStore from '../../mobx/stores/hfStore/WishListStore';
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
  }

  async onStarClick(data, index) {
    showLog("PRODUCT COMPONENT JS ==> "+JSON.stringify(data))
    // showAlert("PRODUCT COMPONENT JS ==> "+JSON.stringify(data))
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
    // CategoryStore.load();
  }

  

  async reloadProducts() {
    let store = AllProductStore;
    await store.load().then((success) => {;
      if(store.products.length != 0) {
        this.setState({
          list: store.dataSource._dataBlob.s1
        })
      }
    });
  }

  render() {    
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
                      showLog("Product Component ProductDetail ==>"+JSON.stringify(item))
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
            })
          }
      </View>
      </ScrollView>
    )
  }
}
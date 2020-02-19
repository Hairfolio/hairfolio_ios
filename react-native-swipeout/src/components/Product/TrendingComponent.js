import { FONTS, Image, ScrollView, Text, TouchableOpacity, View, windowHeight, windowWidth } from 'Hairfolio/src/helpers';
import { observer } from "mobx-react";
import React, { Component } from "react";
import { StyleSheet} from 'react-native';
import NavigatorStyles from '../../common/NavigatorStyles';
// import { BASE_URL } from '../../constants';
import { COLORS, showLog, showAlert, ActivityIndicator } from '../../helpers';
import TrendingStore from '../../mobx/stores/hfStore/TrendingStore';
import CartStore from '../../mobx/stores/hfStore/CartStore';
// import CategoryStore from '../../mobx/stores/hfStore/CategoryStore';
import WishListStore from '../../mobx/stores/hfStore/WishListStore';
import { SCALE } from '../../style';

@observer
export default class TrendingProduct extends Component{
  constructor(props) {
    super(props);
    this.state ={
      list: []
    }
  }

  componentDidMount() {
    let store = TrendingStore;
    // this.setState({list: store.dataSource._dataBlob.s1});
    if(this.props.categoriesData){
      this.setState({list: this.props.categoriesData});
    }
  }

  async onStarClick(data, index) {

    showLog("RELATED PRODUCT COMPONENT ==> "+JSON.stringify(data))
    // showLog("RELATED PRODUCT COMPONENT ==> "+JSON.stringify(data))
    
    let wishListStore = WishListStore;
  
    if (data.is_favourite) {
      await wishListStore.removeProductFromWishList(data.id).then((result) => {
        if (result.status == "201") {

          wishListStore.isLoading = true

          let temp = TrendingStore.trendingProducts
          temp[index].is_favourite = false
          TrendingStore.trendingProducts = temp
         
          setTimeout(()=>{
          wishListStore.isLoading = false
         },250)

        }
        else {
          showAlert('Something went wrong!')
        }
        // showLog("PRODUCT ARR Remove==> " + JSON.stringify(this.state.productArr))
      });
    } else {
      await wishListStore.addProductToWishList(data.id).then((result) => {
        if (result.status == "201") {
          this.reloadProducts(index);
        }
      });
    }
  }

  async reloadProducts(index) {

    WishListStore.isLoading = true
    let temp = TrendingStore.trendingProducts
     showLog("RELATED PRODUCT COMPONENT TEMP ==> "+JSON.stringify(temp))
    temp[index].is_favourite = true
    TrendingStore.trendingProducts = temp

    setTimeout(()=>{
      WishListStore.isLoading = false
     },250)

  }

  render() {    
    let store = TrendingStore;

    if (WishListStore.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    return(
      <ScrollView>
      <View style={styles.mainContainer}>
          {store.trendingProducts.map((item,index)=>{
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
                  }} onPress={()=> {
                    this.props.navigator.push({
                      screen: 'hairfolio.ProductDetail',
                      navigatorStyle: NavigatorStyles.tab,
                      passProps: {
                        prod_id: item.id,
                        categoryTitle: item.name
                      }
                    });
                  }}>
                <Image               
                  // source={(item.product_image) ? { uri: (BASE_URL + item.product_image)} : require('img/medium_placeholder_icon.png')}
                  source={(item.product_image) ? { uri: item.product_image } : require('img/medium_placeholder_icon.png')}
                  style={styles.productImageView} />
                  <TouchableOpacity 
                    style={styles.imageClickView}
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
                      showLog("ProductDetail ==>"+JSON.stringify(item))
                      let prod_id= item.id;
                      showLog(" RELATED PRODUCT COMPONENT ==> "+JSON.stringify(item))
                      
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
                    style={[styles.finalPriceLabel, { color: COLORS.BLACK }]}>{(item.final_price) ? ("$" + item.final_price) : "$0.0"}</Text>
                }
              </View>
            </View>
            })
          }
      </View>
      </ScrollView>
    )
  }
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
  color:COLORS.DISCOUNT_RED,
  fontFamily:FONTS.ROMAN,
  fontSize:SCALE.h(27),
  marginLeft:10
}

});
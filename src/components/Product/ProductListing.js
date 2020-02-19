import { h, Image, observer, React, ScrollView, StyleSheet, Text, TouchableOpacity, View, windowWidth } from 'Hairfolio/src/helpers';
import NavigatorStyles from '../../common/NavigatorStyles';
import { BASE_URL } from '../../constants';
import { COLORS, FONTS } from '../../style';
import AllProductStore from "../../mobx/stores/hfStore/AllProductStore";
import SearchProductStore from "../../mobx/stores/hfStore/SearchProductsStore";
import ProductTagStore from "../../mobx/stores/ProductTagStore";
import { showLog } from '../../helpers';
import { observable } from 'mobx';



const ProductListing = observer(({product, navigator, title, saleData}) => {
  // alert("PRODUCT LISTING ==> "+JSON.stringify(product.product_thumb))
  const placeholder_icon = require('img/medium_placeholder_icon.png'); 
  return (
    <View style={styles.wrapper}>
     
      <View style={ (product.length > 0) ? styles.headerContainer : {height:0}}>
        <Text style={styles.categoryTitle} >
          {title}
        </Text>

        <TouchableOpacity style={styles.viewAllWrapper} onPress={
              () => {
                AllProductStore.isFrom = title;
                
                // alert("TITLE ==> "+JSON.stringify(product[0]))

                SearchProductStore.searchString = "";
                SearchProductStore.updateValues();
                SearchProductStore.products = [];
                SearchProductStore.isFrom=false;

                ProductTagStore.lastSearchedText = "";

                showLog("IS FROM STORE ==> "+JSON.stringify(title))
                if(title == "New Arrivals")
                {
                  ProductTagStore.isNewArrival = true;
                  ProductTagStore.isTrending = null;
                  ProductTagStore.sale_id = null;
                }
                else if(title == "Sale")
                {
                  ProductTagStore.isNewArrival = null;
                  ProductTagStore.isTrending = null;
                  ProductTagStore.sale_id = saleData.id;
                }
                else
                {
                  ProductTagStore.isTrending = true;
                  ProductTagStore.isNewArrival = null;
                  ProductTagStore.sale_id = null;
                }
                
                navigator.push({
                    screen: 'hairfolio.ProductViewAll',
                    navigatorStyle: NavigatorStyles.tab,
                    passProps:{ 
                      categoryTitle : title, 
                      isFrom:title
                    }
                  });
              }
            }>
          <Text style={styles.viewAllText}>
            View All
          </Text>
          <Image style={ (product.length > 0) ? styles.viewAllImage : {height:0}}
            source={require('img/arrow_icon.png')}/>
        </TouchableOpacity>
      </View>
      <ScrollView
        bounces={false}
        showsHorizontalScrollIndicator={false}
        style={{width: windowWidth - 15, paddingTop:5, paddingRight:5, paddingLeft:2}}
        horizontal={true}>
        { 
          product 
          ? 
          product.map((data, index) => {
            
            return (
              <View style={styles.productListingWrapper}>
              <TouchableOpacity style={styles.productTouchable}
                onPress={
                  () => {
                    navigator.push({
                        screen: 'hairfolio.CategoryProductsList',
                        navigatorStyle: NavigatorStyles.tab,
                        passProps:{ productsList : product, 
                          selectedProductIndex: index, 
                          categoryId: product.id 
                        }
                      });
                  }
                }>
                  <Image
                    style={styles.productImage}
                    defaultSource={placeholder_icon}
                    // source={(data.product_image!= null) ? {uri: BASE_URL + data.product_image} : require('img/medium_placeholder_icon.png')}
                    source={(data.product_thumb) ? 
                              { uri: data.product_thumb } : 
                              placeholder_icon}
                    onError={()=>{
                        data.product_thumb = data.product_image;
                        // data.product_thumb = "";
                    }}                                   
                  />
              </TouchableOpacity>
              <Text numberOfLines={2} style = {styles.productName}>
                {data.name}
              </Text>
            </View>
            )
          })
          :
          null
        }
      </ScrollView>
    </View>
  );
});
export default ProductListing;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor:COLORS.WHITE, 
    padding: 10
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between" 
  },
  categoryTitle: { 
    color:COLORS.BLACK,
    fontFamily:FONTS.ROMAN,
    fontSize: h(30)
  },
  viewAllWrapper: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  viewAllText: { 
    color:COLORS.BLACK,
    fontFamily:FONTS.ROMAN,
    fontSize: h(30)
  },
  viewAllImage: {
    height: h(25),
    width: h(25)
  },
  productListingWrapper: { 
    width: h(220),
    marginRight:5,
  },
  productTouchable: {  
    height: h(300), width: h(220) ,           
    borderRadius: 5,
    justifyContent:'center',
    alignItems:'center',
    elevation: 1,
    shadowOpacity: 0.10,
    backgroundColor:COLORS.WHITE,
    shadowOffset: {
      height: 1.2,
      width: 1.2
    } 
  },
  productImage: {
    height: h(300),
    width: h(220), 
    borderRadius: 5,
    resizeMode:'contain',
    flex:1
  },
  productName: {
    fontFamily: FONTS.LIGHT,
    fontSize: h(24),
    textAlign: "center",
    color:COLORS.DARK2,
    backgroundColor:COLORS.TRANSPARENT,
    paddingTop:5,
    paddingLeft:5,
    paddingRight:5
  }
});
import { h, Image, observer, React, ScrollView, StyleSheet, Text, TouchableOpacity, View, windowWidth } from 'Hairfolio/src/helpers';
import NavigatorStyles from '../../common/NavigatorStyles';
import { BASE_URL } from '../../constants';
import { COLORS, FONTS } from '../../style';
import { showLog } from '../../helpers';
import RelatedProductStore from '../../mobx/stores/hfStore/RelatedProductStore';

const RelatedProductListing = observer(({product, navigator, title}) => {
  showLog("RELATED PRODUCT LISTING ==> "+JSON.stringify(product))
  // RelatedProductStore.relatedProducts = product;
  const placeholder_icon = require('img/medium_placeholder_icon.png');
  return (
    <View style={styles.wrapper}>
     
      <View style={ (product.length > 0) ? styles.headerContainer : {height:0}}>
        <Text style={styles.categoryTitle} >
          {title}
        </Text>

        <TouchableOpacity style={styles.viewAllWrapper} onPress={
              () => {
                RelatedProductStore.relatedProducts = product;

                showLog("RELATED PRODUCT VIEW ALL ==> "+ JSON.stringify(product))
                // alert("RELATED PRODUCT VIEW ALL ==> "+ JSON.stringify(product))

                // return;
                navigator.push({
                    screen: 'hairfolio.RelatedProductViewAll',
                    navigatorStyle: NavigatorStyles.tab,
                    passProps:{ categoryTitle : title }
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
                    
                    showLog("TO CATEGORY RELATED PRODUCT LIST ==> "+JSON.stringify(product))
                    showLog("TO CATEGORY RELATED PRODUCT LIST AT INDEX ==> "+JSON.stringify(product[index]))
                    RelatedProductStore.relatedProducts = product;
                    
                    
                    navigator.push({
                      screen: 'hairfolio.CategoryRelatedProductsList',
                      navigatorStyle: NavigatorStyles.tab,
                      passProps:{ productsList : product, 
                                selectedProductIndex: index, 
                                categoryId: product.id
                               }
                    });

                    // navigator.push({
                    //     screen: 'hairfolio.CategoryRelatedProductsList',
                    //     navigatorStyle: NavigatorStyles.tab,
                    //     passProps:{ productsList : product, 
                    //               selectedProductIndex: index, 
                    //               categoryId: product.id
                    //              }
                    //   });
                  }
                }>
                  <Image
                    style={styles.productImage}
                    defaultSource={placeholder_icon}
                    // source={(data.product_image!= null) ? {uri: BASE_URL + data.product_image} : require('img/medium_placeholder_icon.png')}
                    source={(data.product_image) ? 
                                { uri: data.product_image } : 
                                  placeholder_icon}
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

export default RelatedProductListing;


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
  productImage: {
    height: h(300),
    width: h(220), 
    flex:1,
    borderRadius: 5,
    resizeMode:'contain'
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
  
});
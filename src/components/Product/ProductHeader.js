import { h, Image, observer, React, StyleSheet, Text, TouchableOpacity, View, windowWidth } from 'Hairfolio/src/helpers';
import NavigatorStyles from '../../common/NavigatorStyles';
import { BASE_URL } from '../../constants';
import { showLog } from '../../helpers';
import { COLORS, FONTS, SCALE } from '../../style';
import ProductTagStore from '../../mobx/stores/ProductTagStore';
import SearchProductStore from "../../mobx/stores/hfStore/SearchProductsStore";

const ProductHeader = observer(({backgroundImage, navigator, title, isFrom}) => {  
  // var image = BASE_URL+backgroundImage;
  const placeholder_icon = require('img/medium_placeholder_icon.png');  
  var image = backgroundImage;
  showLog("ProductHeader image ==> " + image);


  onClickBanner = () => {

    SearchProductStore.searchString = "";
    SearchProductStore.updateValues();
    SearchProductStore.products = [];
    SearchProductStore.isFrom = false;

    ProductTagStore.lastSearchedText = "";

    if (isFrom == "New Arrivals") {
      ProductTagStore.isNewArrival = true;
      ProductTagStore.isTrending = null;
      ProductTagStore.sale_id = null;
    }
    else if (isFrom == "Sale") {
      ProductTagStore.isNewArrival = null;
      ProductTagStore.isTrending = null;
      ProductTagStore.sale_id = saleData.id
    }
    else {
      ProductTagStore.isTrending = true;
      ProductTagStore.isNewArrival = null;
      ProductTagStore.sale_id = null;
    }

    navigator.push({
      screen: 'hairfolio.ProductViewAll',
      navigatorStyle: NavigatorStyles.tab,
      passProps: { categoryTitle: title }
    });

  }
  
  return (
    <TouchableOpacity style={styles.wrapper}

      onPress={()=>{
        onClickBanner()
      }}

    >
      <Image
      style={styles.backgroundStyle}
      defaultSource={placeholder_icon}
      source={(backgroundImage != null) ? {uri:  image} : placeholder_icon}
      />
      <View  style={styles.shopNowWrapper}>
    
        <TouchableOpacity style={styles.shopNowBtn} onPress={() => {
          showLog("IS FROM STORE ==> " + JSON.stringify(title))
          onClickBanner()
        }}>
          <Text style={styles.shopNowTextBtn}>Shop Now</Text>
        </TouchableOpacity>

      </View>
    </TouchableOpacity>
  );
});

export default ProductHeader;

const styles = StyleSheet.create({
  wrapper: {
    // paddingTop: 20,
    paddingTop: 10,
  },
  shopNowBtn: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: h(115),
    backgroundColor: COLORS.WHITE,
    paddingVertical: h(10),
    paddingHorizontal: h(130),
    elevation: 1,
    shadowOpacity: 0.20,
    shadowOffset: {
      height: 1.2,
      width: 1.2
    } 
  },
  shopNowTextBtn: {
    fontFamily: FONTS.ROMAN, 
    fontSize:SCALE.h(27),
    color: COLORS.BLACK
  },
  shopNowWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width:windowWidth
  },
  backgroundStyle: { 
    height: windowWidth , 
    width: windowWidth,
    resizeMode:'cover',
    flex:1
  }
});

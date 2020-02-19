import { h, Image, observer, React, StyleSheet, Text, TouchableOpacity, View, windowWidth } from 'Hairfolio/src/helpers';
import NavigatorStyles from '../../common/NavigatorStyles';
import { BASE_URL } from '../../constants';
import { showLog } from '../../helpers';
import { COLORS, FONTS, SCALE } from '../../style';
import ProductTagStore from '../../mobx/stores/ProductTagStore';

const SalesHeader = observer(({backgroundImage, navigator, title, saleData}) => {  
  // var image = BASE_URL+backgroundImage;
  const placeholder_icon = require('img/medium_placeholder_icon.png'); 
  var image = backgroundImage;
  showLog("SALES HEADER IMAGE ==> " + image);
  showLog("SALES HEADER DATA  ==> " + JSON.stringify(saleData));
  
  onClickBanner = () => {

    ProductTagStore.isNewArrival = null;
    ProductTagStore.isTrending = null;
    ProductTagStore.sale_id = saleData.id

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

      <View style={styles.shopNowWrapper}>

        <TouchableOpacity style={styles.shopNowBtn} onPress={() => {
          
          onClickBanner()
         
        }}>
          <Text style={styles.shopNowTextBtn}>Shop Now</Text>
        </TouchableOpacity>

      </View>
   
    </TouchableOpacity>
  );
});

export default SalesHeader;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 20,
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
    height: windowWidth, 
    width: windowWidth,
    resizeMode:'contain',
    flex:1
  }
});

import { observer, React, View } from 'Hairfolio/src/helpers';
import ProductHeader from './ProductHeader';
import ProductListing from './ProductListing';
import { showLog } from '../../helpers';

const ProductHome = observer(({product, navigator, title, productImage}) => {
  // showLog("PRODUCT HOME ==> "+JSON.stringify(product[0]))

  showLog("PRODUCT HOME PRODUCT ==> "+JSON.stringify(productImage))
  
  return (
    <View>
      {
        (product) ?
          (product[0]) ?
      
      <ProductHeader backgroundImage={productImage} 
      // backgroundImage={product[0].product_image}
                     title={product[0].name} 
                     isFrom = {title}
                     navigator={navigator}/>
        :
        null
        :
        null
      }
      <ProductListing title={title} product={product} navigator={navigator}/>
      
    </View>
  );
});

export default ProductHome;
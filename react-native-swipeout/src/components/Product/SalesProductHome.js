import { observer, React, View } from 'Hairfolio/src/helpers';
import ProductHeader from './ProductHeader';
import ProductListing from './ProductListing';
import { showLog } from '../../helpers';
import SalesHeader from './SalesHeader';
import SalesStore from '../../mobx/stores/hfStore/SalesStore'

const SalesProductHome = observer(({product, navigator, title,productImage}) => {
  showLog(" SALES PRODUCT HOME ==> "+JSON.stringify(SalesStore.salesProducts[0]))

  // showLog("PRODUCT HOME PRODUCT ==> "+JSON.stringify(product[0].product_image))
  
  return (
    <View>
      {(SalesStore.salesProducts[0]) ? 
        
          <SalesHeader backgroundImage={productImage} 
                      //  backgroundImage={SalesStore.salesProducts[0].product_image}  
                       title={SalesStore.salesProducts[0].name} 
                       saleData={product.sale} 
                       navigator={navigator}/>
        
        :
          null
        }
   

      <ProductListing title={title}
                      product={SalesStore.salesProducts} 
                      saleData={product.sale}
                      navigator={navigator}/>
       
    </View>
  );
});

export default SalesProductHome;

import { observable, computed } from "mobx";
import { ListView } from "react-native";
import ServiceBackend from "../../../backend/ServiceBackend";
import { ENDPOINT, BASE_URL } from "../../../constants";
import { showLog } from "../../../helpers";
import ProductTagModule from '../ProductTagStore';

class SalesStore {
  @observable salesProducts = [];
  @observable saleData = null;
  // @observable arrStoreLandingPage = ["New Arrivals","Trending"];
  @observable isLoading = false;
  @observable nextPage;

  constructor() {
    this.salesProducts = [];
    this.saleData = null;
    this.isLoadingNextPage = false;
  }

  // @computed get dataSource() {
  //   const ds = new ListView.DataSource({
  //     rowHasChanged: (r1, r2) => r1 !== r2
  //   });
  //   return ds.cloneWithRows(this.arrStoreLandingPage.slice());
  // }

  getProductsByCategory(categoryId) {
    showLog("categoryId ==> " + categoryId);
    let arr = this.salesProducts;
    showLog(
      "arr ==> " +
        JSON.stringify(this.salesProducts.filter(item => item.id == categoryId))
    );
    return this.trendingProducts.filter(item => item.id == categoryId);
  }

  getProductByPosition(categoryId, productId) {
    let arr = this.salesProducts;
    return arr.filter(item => item.id == categoryId).products[productId];
  }

  updateProductByPosition(isFav, categoryId, productId) {
    this.salesProducts.map((obj, index) => {
      if (obj.id == categoryId) {
        obj.products.map((p, i) => {
          if (p.id == productId) {
            p.is_favourite = isFav;
            return;
          }
        });
        return;
      }
    });
  }

  async load(initData) {
    this.isLoading = true;
    this.initData = initData;

    this.salesProducts = [];
    this.nextPage = 1;

    await this.loadNextPage();

    this.isLoading = false;
  }


  async getSalesProductsList(saleid) {
    let arrSelectedIds = [];
    this.isLoading = true
    
    let postData = {
      search:"",
      price_start: "", 
      price_end: "",
      new_arrival: null,
      is_trending: null,
      sale: saleid
    };

    showLog("postData SALES ==> " + JSON.stringify(postData))

    let res = await ServiceBackend.post(`searches/filter_products`,postData);
    this.isLoading = false;
    let { products } = res;
    if (products) {
      // res = products;
      showLog("SALES PRODUCTS LIST ==> " + JSON.stringify(products))
      this.salesProducts = products;
      return this.salesProducts;
    }
    return res;
  }

  async getSales(pageNumber) {
    let res = await ServiceBackend.get(ENDPOINT.fetch_Sale);
    if (res) {
      showLog("SALES STORE ==> "+JSON.stringify(res))
      this.saleData = res;

      return this.saleData;

      // return res;
    } else {
      return null;
    }
    // return res;
  }

 
}

const store = new SalesStore();

export default store;

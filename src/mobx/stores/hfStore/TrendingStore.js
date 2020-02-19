
import { observable, computed } from "mobx";
import { ListView } from "react-native";
import ServiceBackend from "../../../backend/ServiceBackend";
import { ENDPOINT } from "../../../constants";
import { showLog } from "../../../helpers";

class TrendingStore {
  @observable trendingProducts = [];
  // @observable arrStoreLandingPage = ["New Arrivals","Trending"];
  @observable isLoading = false;
  @observable nextPage;
  @observable isLoadingNextPage = false;
  @observable initData;

  constructor() {
    this.trendingProducts = [];
    this.isLoadingNextPage = false;
    this.nextPage = null;
    this.isLoading = false;
    this.initData = null;
  }

  // @computed get dataSource() {
  //   const ds = new ListView.DataSource({
  //     rowHasChanged: (r1, r2) => r1 !== r2
  //   });
  //   return ds.cloneWithRows(this.arrStoreLandingPage.slice());
  // }

  getProductsByCategory(categoryId) {
    showLog("categoryId ==> " + categoryId);
    let arr = this.trendingProducts;
    showLog(
      "arr ==> " +
        JSON.stringify(this.trendingProducts.filter(item => item.id == categoryId))
    );
    return this.trendingProducts.filter(item => item.id == categoryId);
  }

  getProductByPosition(categoryId, productId) {
    let arr = this.trendingProducts;
    return arr.filter(item => item.id == categoryId).products[productId];
  }

  updateProductByPosition(isFav, categoryId, productId) {
    this.trendingProducts.map((obj, index) => {
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

    this.trendingProducts = [];
    this.nextPage = 1;

    await this.loadNextPage();

    this.isLoading = false;
  }

  async getTrendingCategories(pageNumber) {
    let res = await ServiceBackend.get(ENDPOINT.trendingProducts);
    if (res) {
    //   alert("getCategories ==>" + JSON.stringify(res.products));
    // if(res.products)
    // {
      showLog("TRENDING CATEGORIES ==> "+JSON.stringify(res))
      this.trendingProducts = res.products;
      
      return this.trendingProducts;
    }
    // else
    // {
    //   return res
    // }
      
    // }
     else {
      return null;
    }
    // return res;
  }


  async getCategories(pageNumber) {
    let res = await ServiceBackend.get(ENDPOINT.trendingProducts);
    if (res) {
    //   alert("getCategories ==>" + JSON.stringify(res.products));
      return res;
    } else {
      return null;
    }
    // return res;
  }

  async loadNextPage() {

    if (!this.isLoadingNextPage && this.nextPage != null) {
    // if (this.nextPage != null) {

      // this.isLoadingNextPage = true;
      let res = await this.getCategories(this.nextPage);

      showLog("TRENDING PRODUCTS STORE ABC ==>" + JSON.stringify(res));

      let { products, meta } = res;

      if (products) {

        this.isLoadingNextPage = false;
        if(meta)
        {
          this.nextPage = meta.next_page;
        }
        for (let a = 0; a < products.length; a++) {
          this.trendingProducts.push(products[a]);
        }
      } else {
        this.isLoadingNextPage = false;
        throw res.errors;
      }

      return this.trendingProducts;
    }
  }
}

const store = new TrendingStore();

export default store;



import { observable, computed } from "mobx";
import { ListView } from "react-native";
import ServiceBackend from "../../../backend/ServiceBackend";
import UserStore from "../UserStore";
import { showLog, showAlert } from "../../../helpers";

class WishListStore {
  @observable products = [];
  @observable isLoading = false;
  @observable nextPage;

  constructor() {
    this.products = [];
    this.isLoadingNextPage = false;
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.products.slice());
  }

  async load(initData) {
    this.isLoading = true;
    this.initData = initData;

    this.products = [];
    this.nextPage = 1;

    await this.loadNextPage();

    this.isLoading = false;
  }

  async getWishListProducts(pageNumber) {
    let res = await ServiceBackend.get(
      `user/favourites/${UserStore.user.id}?page=${pageNumber}`
    );
    showLog("WISHLIST RES ==> " + JSON.stringify(res));
    return res;
  }

  async addProductToWishList(productId) {
    // alert("WISHLIST PRODUCT ID ==> "+productId)
    // return;
    // this.isLoading = true;
    let res = await ServiceBackend.post(`products/${productId}/favourites`);
    if (res) {
      // this.isLoading = false;
      showLog("ADD PRODUCT ==> " + JSON.stringify(res));
      if(res.error){
        showAlert('Something went wrong!')
      }
      return res;
    } else {
      return null;
    }
  }

  async removeProductFromWishList(productId) {
    // this.isLoading = true;
    let res = await ServiceBackend.delete(`products/${productId}/favourites`);
    if(res.error){
      showAlert('Something went wrong!')
    }
    showLog("REMOVE PRODUCT FROM WISHLIST ==> "+JSON.stringify(res))
    // this.isLoading = false;
    return res;
  }

  async loadNextPage() {
    if (!this.isLoadingNextPage && this.nextPage != null) {
      this.isLoadingNextPage = true;
      let res = await this.getWishListProducts(this.nextPage);
      let { favourites } = res;
      if (favourites) {
        for (let a = 0; a < favourites.length; a++) {
          this.products.push(favourites[a]);
        }
        showLog("this.products.length ==> " + this.products.length);
        this.isLoadingNextPage = false;
      } else {
        this.isLoadingNextPage = false;
        throw res.errors;
      }
    }
  }
}

const store = new WishListStore();

export default store;

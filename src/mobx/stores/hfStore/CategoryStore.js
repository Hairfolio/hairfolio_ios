import { observable, computed } from "mobx";
import { ListView } from "react-native";
import ServiceBackend from "../../../backend/ServiceBackend";
import { showLog } from "../../../helpers";

class CategoryStore {
  @observable categories = [];
  @observable isLoading = false;
  @observable nextPage;

  constructor() {
    this.categories = [];
    this.isLoadingNextPage = false;
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.categories.slice());
  }

  getProductsByCategory(categoryId) {
    showLog("categoryId ==> " + categoryId);
    let arr = this.categories;
    showLog(
      "arr ==> " +
        JSON.stringify(this.categories.filter(item => item.id == categoryId))
    );
    return this.categories.filter(item => item.id == categoryId);
  }

  getProductByPosition(categoryId, productId) {
    let arr = this.categories;
    return arr.filter(item => item.id == categoryId).products[productId];
  }

  updateProductByPosition(isFav, categoryId, productId) {
    this.categories.map((obj, index) => {
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

    this.categories = [];
    this.nextPage = 1;

    await this.loadNextPage();

    this.isLoading = false;
  }


  async getCategories(pageNumber) {
    let res = await ServiceBackend.get(`categories?page=${pageNumber}`);
    if (res) {
      // alert("getCategories ==>" + JSON.stringify(res));
      return res;
    } else {
      return null;
    }
    // return res;
  }

  async loadNextPage() {
    if (!this.isLoadingNextPage && this.nextPage != null) {
      this.isLoadingNextPage = true;
      let res = await this.getCategories(this.nextPage);
      let { categories, meta } = res;
      if (categories) {
        alert("getCategories ==>" + JSON.stringify(categories[0]));
        for (let a = 0; a < categories.length; a++) {
          this.categories.push(categories[a]);
        }

        this.nextPage = meta.next_page;
        this.isLoadingNextPage = false;
      } else {
        this.isLoadingNextPage = false;
        throw res.errors;
      }
    }
  }
}

const store = new CategoryStore();

export default store;

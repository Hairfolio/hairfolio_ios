import { computed, observable } from 'mobx';


class ProductListShopStore {
  @observable users = [];
  @observable isLoading = false;
  @observable isShopShow = false;
  @observable clickedPostId = "";
  @observable isShopListView = false;

  constructor() {

  }

  changeShopStatus(isShop) {

    this.isShopShow = isShop

  }

  async load(postId) {
    this.isLoading = true;

  }

  @computed get isEmpty() {
    return this.users.length == 0;
  }
}

const store = new ProductListShopStore();

export default store;

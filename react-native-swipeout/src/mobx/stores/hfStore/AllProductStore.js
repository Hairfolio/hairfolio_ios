import {observable, computed, action} from 'mobx';
import {ListView} from 'react-native';
import ServiceBackend from '../../../backend/ServiceBackend';
import Picture from '../Picture';
import { v4 } from 'uuid';
import { showLog } from '../../../helpers';

class AllProductStore {
  @observable products = [];
  @observable isLoading = false;
  @observable nextPage
  @observable isFrom = "ProductAll"
  

  constructor() {
    this.products = [];
    this.isLoadingNextPage = false;
  }

  // @computed get dataSource() {
  //   const ds = new ListView.DataSource({
  //     rowHasChanged: (r1, r2) => r1 !== r2
  //   });
  //   return ds.cloneWithRows(this.products.slice());
  // }

  async load(initData) {
    this.isLoading = true;
    this.initData = initData;

    this.products = [];
    this.nextPage = 1;

    await this.loadNextPage();
    
    this.isLoading = false;
  }    

  async getAllProduct(pageNumber,isFrom) {
    let res = ServiceBackend.get(`products?page=${pageNumber}`);
    
    return res;
  }

  async loadNextPage() {
    if (!this.isLoadingNextPage && this.nextPage != null) {
      this.isLoadingNextPage = true;
      let res = (await this.getAllProduct(this.nextPage));      
      let {products, meta} = res;
      if (products) {
        
        for (let a = 0; a < products.length; a++)  {
          this.products.push(products[a]);
        }
        // showLog("All Products=>"+JSON.stringify(res))
        this.nextPage = meta.next_page;
        this.isLoadingNextPage = false;
        this.isLoading = false;
      } else {
        this.isLoadingNextPage = false;
        this.isLoading = false;
        throw res.errors;
      }
    }
  }
}

const store = new AllProductStore();
 
export default store;
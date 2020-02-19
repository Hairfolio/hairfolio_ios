import {observable, computed, action} from 'mobx';
import {ListView} from 'react-native';
import ServiceBackend from '../../../backend/ServiceBackend';
import Picture from '../Picture';
import { v4 } from 'uuid';
import { showLog } from '../../../helpers';
import { PER_PAGE } from '../../../constants';

class ProductSearchStore {
  @observable products = [];
  @observable isLoading = false;
  @observable nextPage;
  @observable isFrom = true;
  @observable searchString = "";
  @observable isIconVisible = (this.searchString && this.searchString.length > 0 ) ? true : false
  

  constructor() {
    this.products = [];
    this.isLoadingNextPage = false;
  }

  updateValues() {
    let temp = this.searchString;
    let v = (temp && temp.length ) > 0;
    this.isIconVisible = v; 
    showLog(this.isIconVisible + ' v=== ' + temp)
  }

  // @computed get dataSource() {
  //   const ds = new ListView.DataSource({
  //     rowHasChanged: (r1, r2) => r1 !== r2
  //   });
  //   return ds.cloneWithRows(this.products.slice());
  // }

  @computed get dataSourceForFilter() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    // alert(this.products.length)
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

  async getAllProduct(pageNumber,isFrom) {
    let res = ServiceBackend.get(`searches/search_products?search=${this.searchString}&page=${pageNumber}&limit=${PER_PAGE}`);
    
    return res;
  }

  async loadNextPage() {
    if (!this.isLoadingNextPage && this.nextPage != null) {
      this.isLoadingNextPage = true;
      let res = (await this.getAllProduct(this.nextPage));      
      let {products, meta} = res;
      this.nextPage = meta.next_page;
      if (products) {
       
        for (let a = 0; a < products.length; a++)  {
          this.products.push(products[a]);
        }
        // showLog("All Products=>"+JSON.stringify(res))
        
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

const store = new ProductSearchStore();
 
export default store;
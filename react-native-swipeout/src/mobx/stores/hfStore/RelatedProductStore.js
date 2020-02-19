import {observable, computed, action} from 'mobx';
import {ListView} from 'react-native';
import ServiceBackend from '../../../backend/ServiceBackend';
import Picture from '../Picture';
import { v4 } from 'uuid';

class RelatedAllProductStore {
  @observable relatedProducts = [];
  @observable isLoading = false;
  @observable nextPage

  constructor() {
    this.products = [];
    this.isLoadingNextPage = false;
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    return ds.cloneWithRows(this.relatedProducts.slice());
  }

}

  

const store = new RelatedAllProductStore();
 
export default store;
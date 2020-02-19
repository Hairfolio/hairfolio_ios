import { observable, computed } from 'mobx';
import ServiceBackend from '../../backend/ServiceBackend';
import Activity from './Activity';
import { showLog } from '../../helpers';
import { ListView} from "react-native";

class ActivityFollowingStore {
  @observable isLoading = false;
  @observable elements = [];
  @observable nextPage = 1;
  @observable isLoadingNextPage = false;

  constructor() {
  }

  async load() {
    this.isLoading = true;
    this.elements = [];
    this.nextPage = 1;
    this.isLoadingNextPage = false;
    await this.loadNextPage();

    this.isLoading = false;
  }

  async loadNextPage() {
    if (this.nextPage != null) {
      this.isLoadingNextPage = true;
      let meta_obj = {};
      let result = await ServiceBackend.get(`notifications?following=true&page=${this.nextPage}`);
      // this.isLoading = false;
      if(result) {
        arr = result.notifications;
        if(result.meta){
          meta_obj = result.meta;      
          this.nextPage = meta_obj.next_page;      
        } else {
          this.nextPage = null;   
        }

        arr = arr.filter(e => e.notifiable_type != 'NilClass');
        this.isLoadingNextPage = false;
        let res = await Promise.all(
          arr.map(
            async e => {
              let a = new Activity();
              return await a.init(e);
            }
          )
        )

        if(res) {
          if(this.elements.length > 0){
            this.elements.push.apply(this.elements, res);
          }else{
            this.elements = res;
          }  
        }
      } else {
        this.isLoadingNextPage = false;
        throw res.errors;
      }
    }
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.elements.slice());
  }
}

const store = new ActivityFollowingStore();

export default store;


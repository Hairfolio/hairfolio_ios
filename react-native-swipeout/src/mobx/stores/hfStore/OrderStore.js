import {
  observable,
  computed
} from "mobx";
import {
  ListView
} from "react-native";
import ServiceBackend from "../../../backend/ServiceBackend";
import { showLog } from "../../../helpers";

let temp_arr = [];
let temp_arr2 = [];

class OrderStore {
  @observable pastOrders = [];
  @observable requestedOrders = [];
  @observable isLoading = false;
  @observable nextPage;

  constructor() {
    this.pastOrders = [];
    this.requestedOrders = [];
    this.isLoadingNextPage = false;
  }

  @computed get dataSourceForPast() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.pastOrders.slice());
  }

  @computed get dataSourceForRequested() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.requestedOrders.slice());
  }

  setPastOrders( arr ){
    this.pastOrders = arr;
  }

  setRequestedOrders( arr ){
    
    this.requestedOrders = arr;
  }

  async load(orderStatus,api_call_type, initData) {
    if(api_call_type == "onPress"){
      temp_arr = [];
      temp_arr2 = [];
    }
    
    this.requestedOrders = [];
    this.pastOrders = [];
    
    this.isLoading = true;
    this.initData = initData;

    this.notification = [];
    this.nextPage = 1;

    showLog("LOAD METHOD ==>"+this.nextPage);

    await this.loadNextPage(orderStatus);

    this.isLoading = false;
  }

  async loadNextPage(orderStatus) {

    
    showLog("orderstore loadNextPage ==>"+this.nextPage);
    
    if (!this.isLoadingNextPage && this.nextPage != null) {
      this.isLoadingNextPage = true;
      let res = await this.getOrders(orderStatus, this.nextPage);
      let {
        orders,
        meta
      } = res;
      if (orders) {
        if(meta)
        {
          this.nextPage = meta.next_page;
        }
        
        showLog("2 orderstore loadNextPage ==>"+this.nextPage);
        this.isLoadingNextPage = false;
        
        for (let a = 0; a < orders.length; a++) {
          if(orderStatus == 'delivered'){
            temp_arr.push(orders[a]);
            this.setPastOrders(temp_arr);
            // this.pastOrders.push(orders[a]);
          }else {
            showLog(" NEW ORDERS ==>"+JSON.stringify(orders.length))
            showLog(" NEW ORDERS2 ==>"+JSON.stringify(this.requestedOrders.length))
            temp_arr2.push(orders[a]);
            this.setRequestedOrders(temp_arr2);
            // this.requestedOrders.push(orders[a]);
          }
        }
        
      } else {
        this.isLoadingNextPage = false;
        throw res.errors;
      }
    }
  }

  async getOrders(orderStatus,pageNumber) {    
    let res = await ServiceBackend.get(`orders?status=${orderStatus}&page=${pageNumber}`);    
    if (res) {      
      showLog("getOrdersList " + orderStatus + " ==>" + JSON.stringify(res));
      return res;
    } else {
      return null;
    }
  }
}

const store = new OrderStore();

export default store;
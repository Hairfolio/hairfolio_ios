import {
    observable,
    computed
  } from "mobx";
  import {
    ListView
  } from "react-native";
  import ServiceBackend from "../../../backend/ServiceBackend";
import { ENDPOINT, PER_PAGE } from "../../../constants";
import { showLog } from "../../../helpers";
  
  class CouponListStore {
    @observable couponList = [];
    @observable isLoading = false;
    @observable nextPage;
    @observable selectedID = "";
    @observable discountRate = "";
    @observable couponDiscount = "";
    @observable couponDiscountRate = 0;
  
    constructor() {
      this.couponList = [];
      this.isLoadingNextPage = false;
    }
  
    @computed get dataSource() {
      const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });
      return ds.cloneWithRows(this.couponList.slice());
    }
  
    async load(initData) {
      this.isLoading = true;
      this.initData = initData;
  
      this.couponList = [];
      this.nextPage = 1;
  
      await this.loadNextPage();
  
      this.isLoading = false;
    }
  
    async loadNextPage() {

      // if (!this.isLoadingNextPage && this.nextPage != null) {
        if (this.nextPage != null) {
        this.isLoadingNextPage = true;
        let res = await this.getCouponList(this.nextPage);
  
        let {
          coupons,
          meta
        } = res;
        if (coupons) {

          this.nextPage = meta.next_page;
          // this.isLoadingNextPage = false;

          for (let a = 0; a < coupons.length; a++) {
            this.couponList.push(coupons[a]);
          }
        //   alert("COUPONS LIST ==> "+JSON.stringify(coupons))
          
        } else {
          this.isLoadingNextPage = false;
          throw res.errors;
        }
      }
    }
  
    async getCouponList(pageNumber) {
      
      let res = await ServiceBackend.get(`${ENDPOINT.get_Coupons}?per_page=${PER_PAGE}&page=${pageNumber}`);
      if (res) {
        showLog("getNotificationList ==>" + JSON.stringify(res));
        return res;
      } else {
        return null;
      }
    }

  }
  
  const store = new CouponListStore();
  
  export default store;
import { observable, action, computed } from "mobx";
import ServiceBackend from "../../../backend/ServiceBackend";
import { ENDPOINT } from "../../../constants";
import { showAlert, showLog, ListView } from "../../../helpers";


class WalletStore {

  
  @observable isLoading = false;
  @observable nextPage;
  @observable tranferHistoryList = [];
  

  constructor() {
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.tranferHistoryList.slice());
  }

  async load(initData) {
    this.isLoading = true;
    this.initData = initData;

    this.tranferHistoryList = [];
    this.nextPage = 1;

    await this.loadNextPage();

    this.isLoading = false;
  }

  
  async loadNextPage() {

    if (!this.isLoadingNextPage && this.nextPage != null) {
      
      this.isLoadingNextPage = true;

        let res = await this.callTransactionHistoryApi(5, this.nextPage);
        
        let {
          wallet_payment_transaction_histories,
          meta
        } = res;
        if (wallet_payment_transaction_histories) {
          this.nextPage = meta.next_page;
          this.isLoadingNextPage = false;
          showLog("TRANSACTION LIST COMMISSION ==> " + JSON.stringify(wallet_payment_transaction_histories))

          for (let a = 0; a < wallet_payment_transaction_histories.length; a++) {
            this.tranferHistoryList.push(wallet_payment_transaction_histories[a]);
          }

        } else {
          this.isLoadingNextPage = false;
          throw res.errors;
        }
      }
  }

  @action async callTransactionHistoryApi(per_page,page){

    // this.isLoading = true
    let res = await ServiceBackend.get(`${ENDPOINT.fetch_transaction_history}?per_page=${per_page}&page=${page}`)
    // this.isLoading = false
    if(res)
    {
      showLog("COMISION LIST ==> "+JSON.stringify(res))
        return res;
    }
    else
    {
      return null;
    }

  }


}



const store = new WalletStore();

export default store;

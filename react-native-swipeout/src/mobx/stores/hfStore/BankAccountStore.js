import {
  observable,
  computed
} from "mobx";
import {
  ListView, Alert
} from "react-native";
import ServiceBackend from "../../../backend/ServiceBackend";
import AddressStore from "../hfStore/CartAddressStore";
import CouponListStore from "../hfStore/CouponListStore";
import { ENDPOINT } from "../../../constants";
import { showLog, showAlert } from "../../../helpers";
import NavigatorStyles from "../../../common/NavigatorStyles";
import CartStore from '../hfStore/CartStore';

class BankAccountStore {
  @observable accountList = [];
  @observable selectedID = "";
  @observable selectedData;
  @observable isLoading = false;
  @observable nextPage;
  @observable accountID = "";
  @observable newAccountResponse;
  @observable addAccountData;
  @observable isFromListScreen = false;

  constructor() {
    this.accountList = [];
    this.isLoadingNextPage = false;
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.accountList.slice());
  }


  async load(initData) {
    this.isLoading = true;
    this.initData = initData;

    this.accountList = [];
    //   this.nextPage = 1;
    let urlPath = `${ENDPOINT.bank_list}limit=10`
    // await this.loadNextPage();
    let res = await this.getAccountList(2);

    let {
      bank_accounts,
      has_more
    } = res;

    if (bank_accounts) {
      for (let a = 0; a < bank_accounts.length; a++) {
        this.accountList.push(bank_accounts[a]);
      }
      //   this.nextPage = meta.next_page;
      this.isLoadingNextPage = has_more;
    } else {
      this.isLoadingNextPage = has_more;
      throw res.errors;
    }

    this.isLoading = false;
  }

  async loadNextPage() {
    // if (!this.isLoadingNextPage && this.nextPage != null) {
      if (this.isLoadingNextPage) {
      this.isLoadingNextPage = true;
      let res = await this.getAccountList(2,this.accountList[this.accountID.accountList.length-1].id);
      // alert("Card LIST ==> "+JSON.stringify(res.cards))

      let {
        bank_accounts,
        has_more
      } = res;
      if (bank_accounts) {
        for (let a = 0; a < bank_accounts.length; a++) {
          this.accountList.push(bank_accounts[a]);
        }
        //   alert("Card LIST ==> "+JSON.stringify(coupons))
        // this.nextPage = meta.next_page;
        this.isLoadingNextPage = has_more;
      } else {
        this.isLoadingNextPage = has_more;
        throw res.errors;
      }
    }
  }


  async getBankAccount(navigator) {
    this.isLoading = true
    let res = await ServiceBackend.get(`${ENDPOINT.get_bank_details}`);
    // let res = await ServiceBackend.get(`coupons?page=${pageNumber}`);
    this.isLoading = false;
    if (res) {
      showLog("get Bank Account ==>" + JSON.stringify(res));
      this.newAccountResponse = res;


      if(res)
      {
        navigator.push({
          screen: 'hairfolio.BankAccountList',
          navigatorStyle: NavigatorStyles.tab,
       }); 
      }
      else
      {
        navigator.push({
          screen: 'hairfolio.WithDrawAmount',
          navigatorStyle: NavigatorStyles.tab,
       }); 
      }

      return res;
    } else {
      return null;
    }
  }


  async getAccountListOnce(navigator) {

    let res = await ServiceBackend.get(`${ENDPOINT.bank_list}limit=10`);
    // let res = await ServiceBackend.get(`coupons?page=${pageNumber}`);
    this.isLoading = false;
    if (res) {
      showLog("BANK LIST RESPONSE ==> "+JSON.stringify(res))
      if(res.bank_accounts.length>0)
      {
          navigator.push({
            screen: 'hairfolio.BankAccountList',
            navigatorStyle: NavigatorStyles.tab,
         }); 
       
      }
      else
      {
          navigator.push({
          screen: 'hairfolio.WithDrawAmount',
          navigatorStyle: NavigatorStyles.tab,
          params: {
            isAccountAvailable: false
          }
        }); 
      }

    } else {
      return null;
    }
  }

  async getAccountList(limit) {
   //
    let res = await ServiceBackend.get(`${ENDPOINT.bank_list}limit=${10}`);
    // let res = await ServiceBackend.get(`coupons?page=${pageNumber}`);
    this.isLoading = false;
    if (res) {
      showLog("BANK LIST RESPONSE ==> "+JSON.stringify(res))
      return res;
    } else {
      return null;
    }
  }

  async getWalletTransferInfo() {
     let res = await ServiceBackend.get(`${ENDPOINT.wallet_info}`);
     this.isLoading = false;
     if (res) {
       CartStore.netPayableWalletAmount = res.amount;
       console.log("Wallet transfer RESPONSE ==> ",JSON.stringify(res))
       return res;
     } else {
       return null;
     }
   }
 


  async placeOrder(navigator, isFromWallet = false) {

    let post_data = {
      "address_params": { "address_id": AddressStore.default_address.id },
      // "payment_params": { "card_id": CardListStore.selectedID },
      "payment_params": (isFromWallet) ?
        {} :
        { "card_id": this.newCardResponse.id },
      "coupon_params": (CouponListStore.selectedID) ?
        { "coupon_id": CouponListStore.selectedID } : {},
      "wallet_params": { "use_wallet_money": true }
    }

    let res = await ServiceBackend.post(`${ENDPOINT.place_order}`, post_data);
    this.isLoading = false
    if (res.errors) {

      showLog("ORDER PLACED ==>" + JSON.stringify(res))
      showAlert("You order unsuccessful " + JSON.stringify(res))
      //  return res;
    }
    else {
      this.showDialog(navigator)
      // return null;
    }
  }

  goToHFStore(navigator) {
    navigator.pop();
    // navigator.popTo({
    //   screen: 'hairfolio.Wallet',
    //   animationType: 'fade',
    //   navigatorStyle: NavigatorStyles.tab
    // });
  }

  showDialogPayOut(message,navigator) {
    Alert.alert(
      'Hairfolio',
      message,
      [
        { text: "OK", onPress: () => this.goToHFStore(navigator) },

      ],
      { cancelable: false }
    );
  }

  showDialogDeleteAcc(message,navigator) {
    Alert.alert(
      'Hairfolio',
      message,
      [
        { text: "OK", onPress: () => {
          this.accountList = []  
          this.load()
        }},

      ],
      { cancelable: false }
    );
  }

  async updateBankAccount(post_data,navigator,id,rowData){
    this.isLoading = true
    let res = await ServiceBackend.put(`${ENDPOINT.bank_account}/${this.selectedID}`,post_data)
    this.isLoading = false
    if(res)
    {
      if (res.errors) {
        this.isLoading = false
        showAlert(res.errors);
      }
      else
      {
        this.selectedID = id,
        this.selectedData = rowData
      }
    }
    else
    {
      return null;
    }
  }



  async addBankAccount(post_data, navigator, isAccountAvailable=true) {
    this.isLoading = true
    let res = await ServiceBackend.post(`${ENDPOINT.bank_account}`, post_data);
    this.isLoading = false
    if (res) {

      if (res.errors) {
        this.isLoading = false
        showAlert(res.errors);
      }
      else {
        // showLog("ADD NEW CARD ==> "+JSON.stringify(res))
        this.newAccountResponse = res
        if(isAccountAvailable) {
          this.load();
          navigator.pop(); 
        } else {
          navigator.push({
              screen: 'hairfolio.BankAccountList',
              navigatorStyle: NavigatorStyles.tab,
          }); 
        }
        showLog("ADD NEW BANK ACCOUNT ==> "+JSON.stringify(res))
        //call this for pay out
        this.selectedID = res.id;
        // this.callPayOutApi(res.id,navigator)
      }

      //  return res;
    } else {
      return null;
    }

  }

  showDialog(navigator) {
    Alert.alert(
      'Hairfolio',
      "Your order has been placed.\nThank you.",
      [
        { text: "OK", onPress: () => this.goToHFStore(navigator) },
       
      ],
      { cancelable: false }
    );
  }

  async deleteAccount(id){

    this.isLoading = true;
    let res = await ServiceBackend.delete(`${ENDPOINT.bank_account}/${id}`)
    this.isLoading = false
    if(res)
    {
      if(res.status == 200)
      {
        // showAlert(res.message)
        this.showDialogDeleteAcc(res.message)
      }
    }
    else
    {
      return null;
    }
  }



  async callPayOutApi(bank_acc_id, navigator) {

    let post_data = {
      "bank_account_id": bank_acc_id
    }
  
    this.isLoading = true
    let res = await ServiceBackend.post(`${ENDPOINT.wallet_payOut}`, post_data);
    this.isLoading = false
    if (res) {

      if (res.errors) {
        this.isLoading = false
        showAlert(res.errors);
      }
      else {

        CartStore.fetchWallet()
        this.showDialogPayOut(res.message,navigator)
        
      }

      //  return res;
    } else {
      return null;
    }


  }


}





const store = new BankAccountStore();

export default store;
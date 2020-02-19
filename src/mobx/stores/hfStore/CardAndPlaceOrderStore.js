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
  
  class CardAndPlaceOrderStore {
    @observable cardList =[];
    @observable isLoading = false;
    @observable nextPage;
    @observable selectedID = "";
    @observable newCardResponse;
  
    constructor() {
      this.cardList = [];
      this.isLoadingNextPage = false;
    }
  
    @computed get dataSource() {
      const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });
      return ds.cloneWithRows(this.cardList.slice());
    }
  
    async load1(initData){
        

        this.isLoading = true;
        this.initData = initData;
    
        this.cardList = [
            {
                "id": 5,
                "is_primary": true,
                "card_number": "************0077",
                "exp_month": 10,
                "exp_year": 2019,
                "brand": "Visa"
            },
            {
                "id": 6,
                "is_primary": false,
                "card_number": "************4444",
                "exp_month": 3,
                "exp_year": 2020,
                "brand": "MasterCard"
            }
        ];
        // this.nextPage = 1;
    

    
        this.isLoading = false;


    }

    async load(initData) {
      this.isLoading = true;
      this.initData = initData;
  
      this.cardList = [];
    //   this.nextPage = 1;
  
    await this.loadNextPage();
    let res = await this.getCardList(this.nextPage);
    
     let {
         cards,
         meta
         } = res;

    if (cards) {
        for (let a = 0; a <cards.length; a++) {
            this.cardList.push(cards[a]);
         }
    //   this.nextPage = meta.next_page;
        this.isLoadingNextPage = false;
      } else {
        this.isLoadingNextPage = false;
        throw res.errors;
     }
  
      this.isLoading = false;
    }
  
    async loadNextPage() {
      if (!this.isLoadingNextPage && this.nextPage != null) {
        this.isLoadingNextPage = true;
        let res = await this.getCardList(this.nextPage);
        // alert("Card LIST ==> "+JSON.stringify(res.cards))

        let {
          cards,
          meta
        } = res;
        if (cards) {
          for (let a = 0; a <cards.length; a++) {
            this.cardList.push(cards[a]);
          }
        //   alert("Card LIST ==> "+JSON.stringify(coupons))
          this.nextPage = meta.next_page;
          this.isLoadingNextPage = false;
        } else {
          this.isLoadingNextPage = false;
          throw res.errors;
        }
      }
    }
  
    async getCardList(pageNumber) {
        let res = await ServiceBackend.get(`${ENDPOINT.get_CardList}?limit=10`);
        // let res = await ServiceBackend.get(`coupons?page=${pageNumber}`);
      if (res) {

        // alert("getCardList ==>" + JSON.stringify(res));
        return res;
      } else {
        return null;
      }
    }
  



  async placeOrder(navigator,isFromWallet=false){

    let post_data = { 
      "address_params": { "address_id" : AddressStore.default_address.id},
      // "payment_params": { "card_id": CardListStore.selectedID },
      "payment_params": (isFromWallet) ?
                            {} :
                            {"card_id": this.newCardResponse.id },
      "coupon_params": (CouponListStore.selectedID) ? 
                        { "coupon_id": CouponListStore.selectedID } : {},
      "wallet_params": { "use_wallet_money": true }
    }

    let res = await ServiceBackend.post(`${ENDPOINT.place_order}`,post_data);
    this.isLoading = false
     if(res.errors){
       
       showLog("ORDER PLACED ==>"+JSON.stringify(res))
       showAlert(res.errors)
      //  return res;
     }
     else
     {
      this.showDialog(navigator)
      // return null;
     }
  }

  goToHFStore(navigator){

    navigator.pop({animated:false})
    navigator.pop({animated:false})
    navigator.pop({animated:false})
    navigator.pop({animated:false})
    navigator.pop({animated:false})
    navigator.pop({animated:false})

    // navigator.resetTo({
    //   screen: 'hairfolio.ProductModule',
    //   animationType: 'fade',
    //   navigatorStyle: NavigatorStyles.tab
    // });  

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

  async addCard(post_data,navigator){
    this.isLoading = true
    let res = await ServiceBackend.post(`${ENDPOINT.add_Card}`,post_data);
    if (res) {
        
        if(res.errors)
        {
          this.isLoading = false
           showAlert(res.errors);
        }
        else
        {
          // showLog("ADD NEW CARD ==> "+JSON.stringify(res))
          this.newCardResponse = res.card
          this.placeOrder(navigator)
        }

        //  return res;
    } else {
       return null;
    }

  }

}
  
  const store = new CardAndPlaceOrderStore();
  
  export default store;
import { observable, action, computed } from "mobx";
import ServiceBackend from "../../../backend/ServiceBackend";
import { ENDPOINT } from "../../../constants";
import { showAlert, showLog, ListView } from "../../../helpers";
import CouponStore from '../hfStore/CouponListStore';

let local_old_arr = null;

class CartStore {

  
  @observable isLoading = false;
  @observable nextPage;
  @observable cartProducts = [];
  @observable commissionList = [];
  @observable totalItems = 0;
  @observable totalPrice = 0;
  @observable totalPayableAmount = 0;
  @observable tempCartProducts = [];
  @observable showUpdateButton = false;
  @observable showUpdateButtonIndex = [];
  @observable numberOfBagItems = 0;
  @observable walletAmount = 0;
  @observable netPayableWalletAmount = 0;
  @observable commissionAmount =0;
  @observable walletId;
  @observable isProductUpdated = false;
  @observable showAl = false;
  

  constructor() {
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.commissionList.slice());
  }

  async load(initData) {
    this.isLoading = true;
    this.initData = initData;

    this.commissionList = [];
    this.nextPage = 1;

    await this.loadNextPage();

    this.isLoading = false;
  }

  
  async loadNextPage() {

    if (!this.isLoadingNextPage && this.nextPage != null) {
      
      this.isLoadingNextPage = true;
      let res = await this.callCommissionApi(5,this.nextPage);

      let {
        wallet_commission_lists,
        meta
      } = res;
      if (wallet_commission_lists) {
        this.nextPage = meta.next_page;
        this.isLoadingNextPage = false;
        showLog("WALLET LIST COMMISSION ==> "+JSON.stringify(wallet_commission_lists))

        for (let a = 0; a < wallet_commission_lists.length; a++) {
          this.commissionList.push(wallet_commission_lists[a]);
        }
       
      } else {
        this.isLoadingNextPage = false;
        throw res.errors;
      }
    }
  }

  async addToCart(prod_id,quantity,unique_codes="") {


    if(quantity > 0)
    {
        let post_data = { 
          "product_id": prod_id,
          "quantity":quantity,
          "unique_codes":(unique_codes != "") ? [unique_codes] : []
        }
        this.isLoading = true;
        let res = await ServiceBackend.post(ENDPOINT.add_to_cart, post_data)
       
        this.isLoading = false;
        if (res) {
          // showLog("CartStore addToCart ==>" + JSON.stringify(res));
          if (res.status == 201) {
            showAlert("Product is added to cart!")
            this.fetchCart();
            // this.totalItemInCart();
          }
          else
          {
            if(res.error)
            {
              showAlert(res.error)
            }
            else
            {
              if (res.errors) {
                showAlert(res.errors)
              }     
            }
          }
        }
    }
    else
    {
      showAlert("Please select quantity!")
    }

  }

  async subtractFromCart(prod_id) {
    let post_data = { "product_id": prod_id };

    this.isLoading = true;
    showLog("subtractFromCart post_data ==>" + JSON.stringify(post_data));
    let res = await ServiceBackend.post(ENDPOINT.minus_from_cart, post_data)
    if (res) {
      showLog("subtractFromCart res ==>" + JSON.stringify(res));
      if (res.status == 201) {
        showAlert("Product is removed from cart!")
        this.totalItemInCart();
      }

      this.isLoading = false;
    }
  }

  async removeFromCart(prod_id) {
    // this.isLoading = true;
    let post_data = { "product_id": prod_id }
    let res = await ServiceBackend.post(ENDPOINT.remove_from_cart, post_data);

    // this.isLoading = false;
    if (res) {
  
      showLog("CartStore addToCart ==>" + JSON.stringify(res));
      showLog("Product is deleted from cart!")
      // }
      this.showAl = true;
      this.totalItemInCart();
      return res;
    }
  

  }

  async updateCart2(prod_id,quantity){
    let post_data = { "product_id": prod_id,
                       "quantity":quantity
                    };
    // alert("Quantity"+quantity)
    this.isLoading = true;
    let res = await ServiceBackend.put(ENDPOINT.update_cart, post_data)

    if (res) {
       this.isLoading = false;
       this.showAl = true;
       this.fetchCart()
       return true;
    }
    else
    {
      this.isLoading=false;
      return true;
    }

  }

  async updateCart(prod_id,quantity,keyIndex){
    let post_data = { "product_id": prod_id,
                       "quantity":quantity
                    };
    // alert("Quantity"+quantity)
    this.isLoading = true;
    let res = await ServiceBackend.put(ENDPOINT.update_cart, post_data)
    if (res) {

        // showAlert("Product is Updated!")
        this.tempCartProducts[keyIndex].units = quantity
        this.showUpdateButton = false
        this.fetchCart2(true)
        this.totalItemInCart();
      // }

      this.isLoading = false;
    }

  }


  @action async callCommissionApi(per_page,page){

    // this.isLoading = true
    let res = await ServiceBackend.get(`${ENDPOINT.fetch_commission_list}?per_page=${per_page}&page=${page}`)
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


  async fetchWallet(){
    this.isLoading = true
    let res = await ServiceBackend.get(ENDPOINT.fetch_cart)
    this.isLoading = false
    if(res)
    {
      if(res.wallet)
      {
        
        this.walletAmount = res.wallet.amount;
        this.netPayableWalletAmount = res.wallet.amount;
        this.walletId = res.wallet.id;
        this.commissionAmount = res.commission_amount.amount;

        // alert("RESP WALLET ==> "+JSON.stringify(this.commissionAmount))


        if(this.totalPrice < this.walletAmount)
        {
          this.totalPayableAmount = 0
        }
        else
        {
          this.totalPayableAmount = this.totalPrice - this.walletAmount
        }
        
      }

    }

  }


  async fetchCart() {
    this.isLoading = true;
    local_old_arr = [];
    let res = await ServiceBackend.get(ENDPOINT.cart_listing)
    if (res) {

      for(i=0;i<res.carts.length;i++)
      {
         local_old_arr.push(JSON.stringify(res.carts[i].product));
      }
     

      this.cartProducts = res.carts;
      this.tempCartProducts = res.carts;

      showLog("CART DATA LIST RESPONSE ==> "+JSON.stringify(res.carts))
      
      this.setCount(this.cartProducts.length) 
      this.totalItemInCart();
    }
    this.isLoading = false;
  }


  async fetchCart2() {
    // CouponStore.couponDiscount = "";
    // CouponStore.couponDiscountRate = 0;
    this.isLoading = true;
    let res = await ServiceBackend.get(ENDPOINT.cart_listing)
    if (res) {
      this.isLoading = false;
      // let last_res = JSON.stringify(res);
      let last_res = null;
      let isMisMatch = false;

      showLog("ALL CART ==> "+JSON.stringify(local_old_arr))

      for(i=0;i<res.carts.length;i++)
      {
        // last_res.push(JSON.stringify(res.carts[i].product));
        let temp = JSON.stringify(res.carts[i].product)
        if(temp != local_old_arr[i])
        {
            CouponStore.couponDiscount = "";
            CouponStore.couponDiscountRate = 0;
            isMisMatch = true;
          // return;
        }
      }


      // if(local_old_arr == last_res){
     if(!isMisMatch){
        return false;
      }else{

        local_old_arr = []
        for(i=0;i<res.carts.length;i++)
        {
         local_old_arr.push(JSON.stringify(res.carts[i].product));
        }
        this.cartProducts = res.carts;
        this.tempCartProducts = res.carts;
  
        showLog("CART DATA LIST RESPONSE ==> "+JSON.stringify(res.carts))
        
        this.setCount(this.cartProducts.length) 
        this.totalItemInCart(); 
        return true;
        // showAlert("Product is Updated!");

      }

    }
    this.isLoading = false;
  }


  

  totalItemInCart() {
    this.totalItems = 0;
    this.totalPrice = 0;
    this.cartProducts.map((data, index) => {
      showLog("totalItemInCart ==>" + JSON.stringify(data));
      // alert("")
      showLog("totalItemInCart Product ==>" + JSON.stringify(data.product));
      
      
      // alert("TOTAL ITEM IN CART ==> "+JSON.stringify(data))

      if(data.product != null)
      {
        this.totalItems = this.totalItems + data.units;

        let temp = parseFloat(this.totalPrice);
        let z = 0, x=0;
        x = (data.units * data.product.final_price);
        temp = temp + x;
        this.totalPrice = temp;
        z = parseFloat(temp);
        temp = z.toFixed(2);
        this.totalPrice = temp;
      }
      else
      {
        this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
      }
      
      if(CouponStore.couponDiscount != "")
      {
        let discPrice  = this.totalPrice*CouponStore.couponDiscountRate/100;
        CouponStore.discountRate = discPrice;
        this.totalPrice = this.totalPrice-CouponStore.discountRate
      }
      
    });
  }

  setCount(count)
  {
    this.numberOfBagItems = count
  }

  getCount() {
    return (this.numberOfBagItems);
  }

}



const store = new CartStore();

export default store;

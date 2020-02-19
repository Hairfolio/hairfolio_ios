import { observable, computed } from "mobx";
import { ListView } from "react-native";
import ServiceBackend from "../../../backend/ServiceBackend";
import { ENDPOINT } from "../../../constants";
import { showLog, showAlert } from "../../../helpers";

class NewArrivalStore {
  @observable categories = [];
  @observable arrStoreLandingPage = ["New Arrivals","Trending", "Sale"];
  @observable arrStoreLandingPage2 = ["New arrival","Trending Now", "Sale"];
  @observable mobileStoreBanners = [];
  @observable isLoading = false;
  @observable nextPage;
  @observable newArrivalBanner="";
  @observable trendingNowBanner="";
  @observable saleBanner="";


  constructor() {
    this.categories = [];
    this.isLoadingNextPage = false;
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.arrStoreLandingPage.slice());
  }

  getBannerImage() {

    showLog("IN GET BANNER")

      for(i=0;i<this.mobileStoreBanners.length;i++)
      {
        showLog("MOBILE STORE BANNER AT  ==> "+JSON.stringify(this.mobileStoreBanners[i]))
        if(this.mobileStoreBanners[i].name == this.arrStoreLandingPage2[0])
        {
          this.newArrivalBanner = this.checkForkeyandReturnValue(this.mobileStoreBanners[i])
          showLog("ARRIVAL BANNER ==> "+ this.newArrivalBanner)
        }
        else if(this.mobileStoreBanners[i].name == this.arrStoreLandingPage2[1])
        {
           this.trendingNowBanner = this.checkForkeyandReturnValue(this.mobileStoreBanners[i])
           showLog("TRENDING NOW BANNER ==> "+ this.trendingNowBanner)
        }
        else if(this.mobileStoreBanners[i].name == this.arrStoreLandingPage2[2])
        {
           this.saleBanner = this.checkForkeyandReturnValue(this.mobileStoreBanners[i])
           showLog("SALES BANNER ==> "+ this.saleBanner)
        }
        else{

          this.newArrivalBanner = ""
          this.trendingNowBanner = ""
          this.saleBanner = ""
        }
      }
  }

  getBannerImage2(name) {
    let image = ""
    this.mobileStoreBanners.filter((e, index) => {
      if (e.name == name) {
        // alert(JSON.stringify(e.is_favourite+"===>"+index))
        if (e.banner_image) {
          if (e.banner_image.url) {
            image = e.banner_image.url
            return image
          }
          else {
            image = ""
            return image
          }
        }
        else {
          image = ""
          return image
        }
      }
      else {
        image = ""
        return image
      }
    });
  }

  checkForkeyandReturnValue(bannerData){

    showLog("BANNER DATA ==> "+JSON.stringify(bannerData))
    if(bannerData.banner_image)
    {
      if(bannerData.banner_image.url)
      {
        return bannerData.banner_image.url
      }
      else
      {
        return ""
      }
    }
    else
    {
      return ""
    }

  }
  
  async getMobileStoreBanners(){
    
    let res = await ServiceBackend.get(ENDPOINT.mobile_store_banners);
    if (res) {
      if(res.mobile_store_banners)
      {
        showLog("MOBILE STORE BANNERS RESPONSE ==>" + JSON.stringify(res.mobile_store_banners));
        this.mobileStoreBanners = res.mobile_store_banners;
        
      }
      else
      {
        showAlert("Something went wrong!!")
      }
      return res;
    } else {
      return null;
    }

  }


  getProductsByCategory(categoryId) {
    showLog("categoryId ==> " + categoryId);
    let arr = this.categories;
    showLog(
      "arr ==> " +
        JSON.stringify(this.categories.filter(item => item.id == categoryId))
    );
    return this.categories.filter(item => item.id == categoryId);
  }

  getProductByPosition(categoryId, productId) {
    let arr = this.categories;
    return arr.filter(item => item.id == categoryId).products[productId];
  }

  updateProductByPosition(isFav, categoryId, productId) {
    this.categories.map((obj, index) => {
      if (obj.id == categoryId) {
        obj.products.map((p, i) => {
          if (p.id == productId) {
            p.is_favourite = isFav;
            return;
          }
        });
        return;
      }
    });
  }

  async load(initData) {
    this.isLoading = true;
    this.initData = initData;

    this.categories = [];
    this.nextPage = 1;

    await this.loadNextPage();

    this.isLoading = false;
  }


  async reloadProductOnUpdate(product_Id){

    let res = await ServiceBackend.get(ENDPOINT.updateProduct+product_Id);
    if (res) {
    //   alert("UPDATED PRODUCT ==>" + JSON.stringify(res));
      return res;
    } else {
      return null;
    }
  }

  async getNewArrivalCategories(pageNumber) {
    // http://hairfolio-prod.herokuapp.com/newarrival_products?page=1&limit=10
    let res = await ServiceBackend.get(ENDPOINT.newArrivals+`?page=${pageNumber}&limit=10`);
    if (res) {
      showLog("NEW ARRIVALS RESPONSE ==>" + JSON.stringify(res.products));
      this.categories = res.products;
      return this.categories;
    } else {
      return null;
    }
    // return res;
  }


  async getCategories(pageNumber) {
    // http://hairfolio-prod.herokuapp.com/newarrival_products?page=1&limit=10
    let res = await ServiceBackend.get(ENDPOINT.newArrivals+`?page=${pageNumber}&limit=10`);
    if (res) {
      showLog("NEW ARRIVALS RESPONSE ==>" + JSON.stringify(res.products));
      return res;
    } else {
      return null;
    }
    // return res;
  }

  async loadNextPage() {
    if (!this.isLoadingNextPage && this.nextPage != null) {
      this.isLoadingNextPage = true;
      let res = await this.getCategories(this.nextPage);
    //   alert("NEW ARRIVAL STOR ==> ")
    showLog("NEW ARRIVAL STORE RESPONSE ==> " + JSON.stringify(res))
  
      let { products, meta } = res;

     

      if (products) {
        this.nextPage = meta.next_page;
        this.isLoadingNextPage = false;
        
        for (let a = 0; a < products.length; a++) {
          this.categories.push(products[a]);
        }

       
      } else {
        this.isLoadingNextPage = false;
        throw res.errors;
      }

      return this.categories;

    }
  }
}

const store = new NewArrivalStore();

export default store;

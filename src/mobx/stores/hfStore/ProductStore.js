import { observable, computed, action } from "mobx";
import { ListView } from "react-native";
import ServiceBackend from "../../../backend/ServiceBackend";
import { showLog, showAlert } from "../../../helpers";
import RelatedProductStore from '../hfStore/RelatedProductStore';

class ProductStore {
  @observable productDetail = null;
  @observable previousRelatedProduct = [];
  @observable previousRelatedProductId = "";
  @observable isLoading = false;
  @observable nextPage;
  @observable prod_gallery = [];
  @observable uniqueCode = "";
  @observable visitedProductsDetail = [];
  @observable firstProduct = null;


  constructor() {
    this.productDetail = {};
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.categories.slice());
  }

  pushProduct(product){

    this.visitedProductsDetail.push(product)
    if(this.visitedProductsDetail.length > 1)
    {
      this.firstProduct = this.visitedProductsDetail[0];
      
    }
    // this.productDetail = product;
    // this.prod_gallery = product.product_galleries;
    showLog("PUSHED PRODUCT ==> "+JSON.stringify(this.visitedProductsDetail))
    showLog("PUSHED LENGTH ==> "+JSON.stringify(this.visitedProductsDetail.length))
  }

  
  popProduct2(){

    let arr = this.visitedProductsDetail;
    // showLog("ON POP PRODUCT DETAIL ==> "+JSON.stringify(this.visitedProductsDetail))
   
    showLog("BEFORE ==> "+JSON.stringify(arr.length))
    // return;
    if(this.visitedProductsDetail.length > -1)
    {
      arr.splice(arr.length-1,1)

      showLog("POPED PRODUCT LENGTH ==> "+JSON.stringify(arr.length))
      showLog("POPED PRODUCT 1 ==> "+JSON.stringify(arr))
      this.visitedProductsDetail = arr
      if(arr.length > 0)
      {
        this.productDetail = arr[arr.length-1];
        if(arr[arr.length-1].product_galleries)
        {
          this.prod_gallery = arr[arr.length-1].product_galleries;
        }
       
      }
      else
      {
        this.productDetail = arr[0];
        if(arr[0].product_galleries)
        {
          this.prod_gallery = arr[0].product_galleries;
        }
        this.visitedProductsDetail = [];
      }
    }
    showLog("ON POP PRODUCT DETAIL ==> "+JSON.stringify(this.productDetail))
    // this.prod_gallery = this.productDetail.product_galleries

  }

  setCurrentProduct(){

    let arr = this.visitedProductsDetail;

    this.productDetail = arr[arr.length-1]
    this.prod_gallery = arr[arr.length-1].product_galleries

    if(arr[arr.length-1].product_galleries.length>0)
    {
        let mainImage = {
          "image_url":arr.product_image,
          "id":arr.id
        }
 
        this.prod_gallery.push(mainImage)
        this.prod_gallery = this.prod_gallery.reverse();
    }

    this.visitedProductsDetail = arr

  }

  popProduct(){

    let arr = this.visitedProductsDetail;
    // showLog("ON POP PRODUCT DETAIL ==> "+JSON.stringify(this.visitedProductsDetail))
   
    showLog("BEFORE ==> "+JSON.stringify(arr.length))
    // return;
    if(arr.length>1)
    {
      arr.splice(arr.length-1,1);
      showLog("POP PRODUCT ==> "+JSON.stringify(arr))
      showLog("CURRENT PRODUCT ==> "+JSON.stringify(arr[arr.length-1]))
      this.productDetail = arr[arr.length-1]
      this.prod_gallery = arr[arr.length-1].product_galleries

      if(this.productDetail.product_galleries.length>0)
      {
        let mainImage = {
         "image_url":this.productDetail.product_image,
          "id":this.productDetail.id
          }
     
      this.prod_gallery.push(mainImage)
      this.prod_gallery = this.prod_gallery.reverse();
      if(arr.length == 1)
      {
        this.visitedProductsDetail = []
      }
      
    }
    // else
    // { 

    //   let product1 = this.firstProduct;
    //   this.productDetail = product1;
    //   this.prod_gallery = product1.product_galleries

    //   if(product1.product_galleries.length>0)
    //   {
    //     let mainImage = {
    //      "image_url":product1.product_image,
    //       "id":product1.id
    //       }
     
    //   product1.push(mainImage)
    //   this.prod_gallery = this.prod_gallery.reverse();
    //     }
    // }
  }

  }


  resetProductStack(){
    this.visitedProductsDetail = [];
  }

  async load(productId, initData) {
    this.isLoading = true;
    this.initData = initData;

    this.productDetail = {};
    this.nextPage = 1;

    await this.getProdDetail(productId, initData);

    this.isLoading = false;
  }

  async getProductDetail(productId, pageNumber) {

    let res = ServiceBackend.get(`products/${productId}?page=${pageNumber}`);    
    return res;
  }

  async getProdDetail(productId) {
    // let res = await this.getProductDetail(productId,this.nextPage);
    try {
      let res = await ServiceBackend.get(`products/${productId}`);

      this.isLoading = false    
      //await this.getProductDetail(productId,1);
      if(res)
      {
        
        if (res.product) {
          
          let { product } = res;

          showLog("productdetail Store ==>" + JSON.stringify(product));
          this.productDetail = product;
          this.prod_gallery = product.product_galleries
  
          if (product.product_galleries.length > 0) {
            let mainImage = {
              "image_url": product.product_image,
              "id": product.id
            }
  
            const rowIndex = 0;
            this.prod_gallery.splice(0, 0, mainImage);
            // this.prod_gallery.push(mainImage)
          }
          this.pushProduct(product)
          return product;
          showLog("productdetail STORE GALLERY ==>" + JSON.stringify(this.prod_gallery.length));
      }
      else
      {
        showLog("RESPONSE ERROR ==> "+res.error)
        return res;
        // alert("RESPONSE ERROR ==>")
      }
      }
    }
    catch (error) {
      showLog("RESPONSE PRODUCT STORE ERROR ==> " + JSON.stringify(error))
      showAlert(error)
    }

  }



}

const store = new ProductStore();

export default store;

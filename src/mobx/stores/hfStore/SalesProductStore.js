// import { observable, computed } from "mobx";
// import { ListView } from "react-native";
// import ServiceBackend from "../../../backend/ServiceBackend";
// import { ENDPOINT } from "../../../constants";
// import { showLog } from "../../../helpers";

// class ProductHomeStore {
//   @observable categories = [];
//   @observable arrStoreLandingPage = ["New Arrivals","Trending", "Sales"];
//   @observable isLoading = false;
//   @observable nextPage;

//   constructor() {
//     this.categories = [];
//     this.isLoadingNextPage = false;
//   }

//   @computed get dataSource() {
//     const ds = new ListView.DataSource({
//       rowHasChanged: (r1, r2) => r1 !== r2
//     });
//     return ds.cloneWithRows(this.arrStoreLandingPage.slice());
//   }

//   getProductsByCategory(categoryId) {
//     console.log("categoryId ==> " + categoryId);
//     let arr = this.categories;
//     console.log(
//       "arr ==> " +
//         JSON.stringify(this.categories.filter(item => item.id == categoryId))
//     );
//     return this.categories.filter(item => item.id == categoryId);
//   }

//   getProductByPosition(categoryId, productId) {
//     let arr = this.categories;
//     return arr.filter(item => item.id == categoryId).products[productId];
//   }

//   updateProductByPosition(isFav, categoryId, productId) {
//     this.categories.map((obj, index) => {
//       if (obj.id == categoryId) {
//         obj.products.map((p, i) => {
//           if (p.id == productId) {
//             p.is_favourite = isFav;
//             return;
//           }
//         });
//         return;
//       }
//     });
//   }

//   async load(initData) {
//     this.isLoading = true;
//     this.initData = initData;

//     this.categories = [];
//     this.nextPage = 1;

//     await this.loadNextPage();

//     this.isLoading = false;
//   }


//   async reloadProductOnUpdate(product_Id){

//     let res = await ServiceBackend.get(ENDPOINT.updateProduct+product_Id);
//     if (res) {
//     //   alert("UPDATED PRODUCT ==>" + JSON.stringify(res));
//       return res;
//     } else {
//       return null;
//     }
//   }


//   async getCategories(pageNumber) {
//     // http://hairfolio-prod.herokuapp.com/newarrival_products?page=1&limit=10
//     let res = await ServiceBackend.get(ENDPOINT.newArrivals+`?page=${pageNumber}&limit=10`);
//     if (res) {
//       showLog("NEW ARRIVALS RESPONSE ==>" + JSON.stringify(res.products));
//       return res;
//     } else {
//       return null;
//     }
//     // return res;
//   }

//   async loadNextPage() {
//     if (!this.isLoadingNextPage && this.nextPage != null) {
//       this.isLoadingNextPage = true;
//       let res = await this.getCategories(this.nextPage);
//     //   alert("NEW ARRIVAL STOR ==> ")
//       let { products, meta } = res;

//       if (products) {
//         // alert("NEW ARRIVAL STOR ==> " + JSON.stringify(products[0]))
//         for (let a = 0; a < products.length; a++) {
//           this.categories.push(products[a]);
//         }

//         this.nextPage = meta.next_page;
//         this.isLoadingNextPage = false;
//       } else {
//         this.isLoadingNextPage = false;
//         throw res.errors;
//       }
//     }
//   }
// }

// const store = new NewArrivalStore();

// export default store;

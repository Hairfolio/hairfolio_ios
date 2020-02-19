import ServiceBackend from "../../backend/ServiceBackend";
import { PostGridStore } from "./PostStore";

const cache = {};

let callingApi = false;

export class UserPostStore extends PostGridStore {
  async getPosts(page) {
    let userId = this.initData;
    if(callingApi == false || callingApi == 'false'){
      callingApi= true;
      
      let res = await ServiceBackend.get(
        // `users/${userId}/posts?page=${this.nextPage}&limit=2`
        `user/userposts/${userId}?page=${this.nextPage}&limit=5`
      );
      if(res){
        callingApi= false;
      }
      return res;
    }
    
  }
}

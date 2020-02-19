import { computed, observable } from "mobx";
import { ListView } from "react-native";
import { showLog } from "../../helpers";
import Post from "./Post";
import UserStore from "../stores/UserStore";

export default class PostStore {
  @observable elements = [];
  @observable isLoading = false;
  @observable nextPage = null;
  @observable isLoadingNextPage = false;
  @observable hasLoaded = false;
  @observable isQrLoading = false;
  @observable qrLoadingText = "";

  constructor() {
    this.elements = [];
    this.hasLoaded = false;
    this.isLoadingNextPage = false;
    this.nextPage = 1;
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.elements.slice());
  }

  reset() {
    this.hasLoaded = false;
    this.elements = [];
    this.isLoadingNextPage = false;
    this.nextPage = 1;
  }

  //getPosts() is pretended to be implemtend by extending classes

  async loadNextPage(id = UserStore.user.id) {
    if (!this.isLoadingNextPage && this.nextPage != null) {
      // this.isLoadingNextPage = true;
      let res = await this.getPosts(this.nextPage, id);
      if (res) {

        let posts = (res.posts) ? res.posts : null;
        let meta = (res.meta) ? res.meta : null;
        // showLog("PostStore loadNextPage ==>" + JSON.stringify(meta));
        // showLog("PostStore DATA ==>" + JSON.stringify(posts));
        if (meta && meta.next_page) {
          this.nextPage = meta.next_page;
        } else {
          this.nextPage = null;
        }
        if (res.likes) {
          let likesArr = [];
          likesArr = res.likes;
          for (let x = 0; x < likesArr.length; x++) {
            let post = new Post();
            await post.init(likesArr[x].post);
            this.elements.push(post);
          }
          this.elements.reverse();
          this.isLoadingNextPage = false;
        } else if (posts) {
          for (let a = 0; a < posts.length; a++) {
            let post = new Post();
            await post.init(posts[a]);
            this.elements.push(post);
          }

          this.isLoadingNextPage = false;
        } else {
          this.nextPage = null;
          this.isLoadingNextPage = false;
          throw res.errors;
        }

      } else {
        this.reset();
      }

    } else {
      this.nextPage = null;
      this.isLoading = false;
      this.isLoadingNextPage = false;
    }
  }


  async loadNextPageOld() {
    if (!this.isLoadingNextPage && this.nextPage != null) {
      // this.isLoadingNextPage = true;
      let res = await this.getPosts(this.nextPage);
      let { posts, meta } = res;
      // showLog("PostStore loadNextPage ==>" + JSON.stringify(meta));
      // showLog("PostStore DATA ==>" + JSON.stringify(posts));
      if(meta)
      {
        this.nextPage = meta.next_page;
      }
      

      if (posts) {
        for (let a = 0; a < posts.length; a++) {
          let post = new Post();
          await post.init(posts[a]);
          this.elements.push(post);
        }
        
        if(meta)
        {
          this.nextPage = meta.next_page;
        }
        
        this.isLoadingNextPage = false;
      } else {
        this.nextPage = null;
        this.isLoadingNextPage = false;
        throw res.errors;
      }
    } else {
      this.nextPage = null;
      this.isLoading = false;
      this.isLoadingNextPage = false;
    }
  }

  get supportPaging() {
    return true;
  }

  async load(initData) {
    let id;

    if(initData){
      if(initData.user_id) {
        id = initData.user_id
      } else {
        id = UserStore.user.id;
      }
    }
    
    this.isLoading = true;
    this.initData = initData;
    this.elements = [];
    this.nextPage = 1;
    await this.loadNextPage(id);
    this.isLoading = false;
    this.isLoadingNextPage = false;
  }

  getNextPage() {
    showLog("getNextPage ==>" + this.nextPage);
    return this.nextPage;
  }
}

export class PostGridStore extends PostStore {
  @computed get list() {
    let arr = this.elements.slice();

    let newArr = [];

    let counter = 0;

    while (counter < arr.length) {
      if (counter + 1 < arr.length) {
        newArr.push([arr[counter], arr[counter + 1]]);
      } else {
        newArr.push([arr[counter], null]);
      }
      counter += 2;
    }

    return newArr;
  }
  @computed get dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.list);
  }
}

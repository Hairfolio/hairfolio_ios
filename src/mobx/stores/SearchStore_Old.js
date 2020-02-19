import { computed, observable } from "mobx";
import { ListView, NativeModules } from "react-native";
import { v4 } from "uuid";
import ServiceBackend from "../../backend/ServiceBackend";
import Picture from "./Picture";
import PostStore, { PostGridStore } from "./PostStore";
import UserStore from "./UserStore";
import { showLog, _ } from "../../helpers";
import Post from "./Post";
import User from "./User";
import FollowUser from "./FollowUser";
import { PER_PAGE, PER_PAGE_FOR_SEARCH } from "../../constants";

let PhotoAlbum = NativeModules.PhotoAlbum;
let tagsResponse = [];

class TagItem {
  @observable picture;
  @observable name;
  @observable id;
  @observable isSelected;
  constructor() {
    this.key = v4();
  }

  async init(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.isSelected = false;
    let picObj = { uri: (obj.last_photo) ? obj.last_photo : ""};
    this.picture = new Picture(picObj, picObj, null);
  }
}

class TopTags extends PostStore {
  @observable limit = 25;
  @observable selectedTags = []
  
  resetTags() {
    this.elements.map((item, index) => {
      item.isSelected = false;
      tagsResponse.push(item);
    })
    this.selectedTags = [];
    this.elements = tagsResponse;
  }

  setTags(arr) {
    this.elements = arr;
  }

  async loadNextPage() {
    if (!this.isLoadingNextPage && this.nextPage != null) {
      this.isLoadingNextPage = true;

      let myId = UserStore.user.id;

      let res = await ServiceBackend.get(
        `tags/all_tags?page=${this.nextPage}`
      );

      let { tags, meta } = res;

      let arr = [];

      for (let a = 0; a < tags.length; a++) {
        let tagItem = new TagItem();
        await tagItem.init(tags[a]);
        this.elements.push(tagItem);
      }

      if(meta.next_page)
        this.nextPage = meta.next_page;

      this.isLoadingNextPage = false;
    }
  }
}

class TrendingEditorPosts extends PostGridStore {
  @observable trendingEditorsRes = [];
  @observable trendingRes = [];
  @observable editorsRes = [];
  @observable trendingTotalCount = 0;
  @observable editorsTotalCount = 0;

  list(isTrending) {
    let arr = [];
    if(!isTrending) {
      arr = this.editorsRes.slice();
    } else {
      arr = this.trendingRes.slice();
    } 

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

  async getPosts() {
    this.isLoading = true;
    let res = await ServiceBackend.get('homepages');
    console.log("getPosts ==>"+JSON.stringify(res));
    this.isLoading = false;
    this.trendingEditorsRes = res.homepages;    
    this.trendingEditorsRes.map(async (item,i) => {
      let posts = item.posts
      if (posts) {
        if(i==0){
          this.trendingTotalCount = posts.length;
        } else {
          this.editorsTotalCount = posts.length;
        }
        for (let a = 0; a < 10; a++) {
          let post = new Post();
          await post.init(posts[a]);
          if(i==0){
            this.trendingRes.push(post);
          } else {
            this.editorsRes.push(post);
          }
        }
      }
    })
  }
}

class HashtagPosts extends PostGridStore {
  @observable hashtagPostsList = [];
  @observable selectedTags = [];
  @observable totalCount = 0;

  async onTagClick(id) {
    let index = this.selectedTags.findIndex(obj => obj == id);
    if(index >= 0) {
      this.selectedTags.splice(index, 1);
    } else {  
      this.selectedTags.push(id);
    }

    this.getPosts();
  }

  async getPosts() {
    this.hashtagPostsList = [];
    this.isLoading = true;
    let postData = {
      tag_ids: this.selectedTags
    };
    let res = await ServiceBackend.post(`posts/hashtag_posts?per_page=${PER_PAGE_FOR_SEARCH}`,postData);
    let meta = res.meta;
    if (meta && meta.total_count) {
      this.totalCount = meta.total_count;
    }
    this.postsList = res.posts;    
    this.postsList.map(async (item,i) => {
      let post = new Post();
      await post.init(item);
      this.hashtagPostsList.push(post);    
    })
    this.isLoading = false;
  }

  list() {
    let arr = [];
    arr = this.hashtagPostsList.slice();
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
}

class SearchAllList extends PostGridStore{
  @observable allSearchResult = [];
  @observable nextPage;

  constructor(){
    super();
    this.nextPage = null;
  }

  list() {
    let arr = [];
    if(this.allSearchResult.length > 0) {
      arr = this.allSearchResult.slice();
    } 
    let newArr = [];
    let counter = 0;

    while (counter < this.allSearchResult.length) {
      if (counter + 1 < this.allSearchResult.length) {
        newArr.push([arr[counter], arr[counter + 1]]);
      } else {
        newArr.push([arr[counter], null]);
      }
      counter += 2;
    }
    return newArr;
  }

  listBkup() {
    let arr = [];
    if(this.allSearchResult.length > 0) {
      arr = this.allSearchResult.slice();
    } 
    let newArr = [];
    let counter = 0;

    while (counter < 10) {
      if (counter + 1 < 10) {
        newArr.push([arr[counter], arr[counter + 1]]);
      } else {
        newArr.push([arr[counter], null]);
      }
      counter += 2;
    }
    return newArr;
  }

  async getPosts(id) {
    this.isLoading = true;
    // if(id) {   

    console.log(`${this.allSearchResult.length} <== Helloo ==> homepages_posts?id=${id}&page=${this.nextPage}`)
    let res = await ServiceBackend.get(`homepages_posts?id=${id}&page=${this.nextPage}`);

    if (res) {

      console.log("cool getPosts ==>" + JSON.stringify(res));

      this.isLoading = false;
      let posts = res.posts;
      let meta = res.meta;

      this.nextPage = meta.next_page;

      if (posts) {
        for (let a = 0; a < posts.length; a++) {
          let post = new Post();
          await post.init(posts[a]);
          this.allSearchResult.push(post);
        }
      }

    }
         
    // } else {
    //   let stylistList = new StylistsList();
    //   stylistList.load();
    //   let arr = stylistList.list();
    //   arr.map((item, i) => {
    //     this.allSearchResult.push(item);
    //   })
    // }
  }

  async loadNextPageNew(id) {

    console.log(`${this.allSearchResult.length} <== Helloo ==> homepages_posts?id=${id}&page=${this.nextPage}`)

    if (this.nextPage != null) {
      let res = await ServiceBackend.get(`homepages_posts?id=${id}&page=${this.nextPage}`);
      if(res){
        console.log("loadNextPage getPosts ==>" + JSON.stringify(res));
        let posts = res.posts;
        let meta = res.meta;
        this.nextPage = meta.next_page;
        for (let a = 0; a < posts.length; a++) {
          let post = new Post();
          await post.init(posts[a]);
          this.allSearchResult.push(post);
        }

      }
    }
  }

  
}

class StylistsList extends PostGridStore{
  @observable isLoadingNextPage = false;
  @observable nextPage;  
  @observable totalCount = 0;
  @observable limit = 25;
  @observable elements;

  constructor(){
    super();
    this.nextPage=1;
    this.elements = [];
  }

  list() {
    let arr = [];
    if(this.elements.length > 0) {
      arr = this.elements.slice();
    } 
    let newArr = [];
    let counter = 0;

    while (counter < this.elements.length) {
      if (counter + 1 < this.elements.length) {
        newArr.push([arr[counter], arr[counter + 1]]);
      } else {
        newArr.push([arr[counter], null]);
      }
      counter += 2;
    }
    return newArr;
  }

  async loadNextPage(page) {
    console.log("this.isLoadingNextPage ==>" + this.isLoadingNextPage + "this.nextPage " + this.nextPage)
    if (!this.isLoadingNextPage && this.nextPage != null) {
      let res = await this.getPosts(this.nextPage);
      if (res) {
        // alert(JSON.stringify(res))
        let meta = res.meta;
        let users = res.users;
        this.isLoading = false;

        if (meta && meta.total_count) {
          this.totalCount = meta.total_count;
        }

        if (users) {
          for (let a = 0; a < 10; a++) {
            let user = new FollowUser();
            await user.init(users[a]);
            this.elements.push(user);
          }

          if (meta.next_page) {
            this.nextPage = meta.next_page;
          } else {
            this.nextPage = null;
          }
          this.isLoadingNextPage = false;
          console.log("this.nextPage in users ==> " + this.nextPage);
          console.log("this.isLoadingNextPage in users ==> " + this.isLoadingNextPage);
        } else {
          this.nextPage = null;
          this.isLoadingNextPage = false;
          console.log("this.nextPage in else ==> " + this.nextPage);
          console.log("this.isLoadingNextPage in else ==> " + this.isLoadingNextPage);
          throw res.errors;
        }
      }
    } else {
      this.nextPage = null;
      this.isLoading = false;
      this.isLoadingNextPage = false;
    }
  }

  async getUserLocation() {
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej, {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 1000
      });
    });
  }

  async getPosts(page = PER_PAGE_FOR_SEARCH) { 
    // let position = await this.getUserLocation();
    return await ServiceBackend.get(`/users/stylist_near_me?latitude=23.01952&longitude=72.5475328?limit=${page}`);
    // return await ServiceBackend.get(`users/stylist_near_me?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
  }
}

class SearchStore {
  // @observable popularPosts;
  @observable topTags;
  @observable isLoading = false;
  @observable loaded;
  // @observable editorsPosts;
  @observable stylistsList;
  @observable trendingEditorPosts;
  @observable searchString;
  @observable searchAllList;
  @observable hashtagPosts;
  @observable isIconVisible = (this.searchString && this.searchString.length > 0 ) ? true : false
  @observable nextPage; 
  @observable list_all_new; 

  constructor() {
    this.elements = [];
    this.searchString = '';
    this.loaded = false;
    this.topTags = new TopTags();
    // this.popularPosts = new PopularPosts();
    // this.editorsPosts = new EditorsPosts();
    this.stylistsList = new StylistsList();
    this.trendingEditorPosts = new TrendingEditorPosts();
    this.hashtagPosts = new HashtagPosts();
    this.searchAllList = new SearchAllList();
    this.list_all_new = [];
  }

  list_all_new = ()=>{
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      ...this.searchAllList.list(true)
    ]);
  }

  updateValues() {
    let temp = this.searchString;
    let v = (temp && temp.length ) > 0;
    this.isIconVisible = v; 
    showLog(this.isIconVisible + ' v=== ' + temp)
  }

  // loadNextPage(id) {
  //   if(id) {
  //     this.loadAllTrendingEditorsPosts(id)
  //   } else {
  //     this.stylistsList.loadNextPage();
  //     this.searchAllList.push(this.stylistsList.list)
  //   }
  // }

  async loadAllTrendingEditorsPosts(id) {
    this.isLoading = true;
    let res = await ServiceBackend.get(`homepages_posts?id=${id}&page=${this.nextPage}&per_page=${PER_PAGE}`);
    this.isLoading = false;
    let posts = res.posts
    if (posts) {
      for (let a = 0; a < posts.length; a++) {
        // let post = new Post();
        // await post.init(posts[a]);
        this.searchAllList.push(post);
      }
    }      
  }

  @computed get trendingDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      ...this.trendingEditorPosts.list(true)
    ]);
  }

  @computed get hashtagPostDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      ...this.hashtagPosts.list()
    ]);
  }

  @computed get stylistsListDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      ...this.stylistsList.list
    ]);
  }
  

  @computed get detailListDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      ...this.searchAllList.list(true)
    ]);
  }
  

  // @computed get dataSource() {
  //   const ds = new ListView.DataSource({
  //     rowHasChanged: (r1, r2) => r1 !== r2
  //   });
  //   return ds.cloneWithRows([
  //     ...this.searchAllList.list
  //   ]);
  // }

  refresh() {
    this.loaded = false;
  }

  async load() {
    if (!this.loaded) {
      // this.popularPosts.load();
      this.topTags.load();
      this.trendingEditorPosts.load();
      // this.editorsPosts.load();
      this.stylistsList.load();
      this.searchAllList.load();
      this.hashtagPosts.load();
      this.loaded = true;
    }
  }

  async search(id) {

    let res = await ServiceBackend.get(`homepages_posts?id=${id}&page=${this.nextPage}`);
    this.isLoading = false;
    let posts = res.posts
    if (posts) {
      for (let a = 0; a < posts.length; a++) {
        let post = new Post();
        await post.init(posts[a]);
        this.allSearchResult.push(post);
      }
    }   

  }

  reset() {
    this.elements = [];
    this.loaded = false;
    this.topTags = new TopTags();
    // this.popularPosts = new PopularPosts();
    // this.editorsPosts = new EditorsPosts();
    this.stylistsList = new StylistsList();
    this.trendingEditorPosts = new TrendingEditorPosts();
    this.searchAllList = new SearchAllList();
    this.hashtagPosts = new HashtagPosts();
    this.searchString = "";
  }

  postDetailsByPosition(pos) {
        // alert(JSON.stringify(this.trendingEditorPosts.trendingEditorsRes[pos]))
    if(this.trendingEditorPosts) {
      if(this.trendingEditorPosts.trendingEditorsRes.length > 0) {
        return this.trendingEditorPosts.trendingEditorsRes[pos];
      }
    }
    return {}
  }
}

const store = new SearchStore();

export default store;

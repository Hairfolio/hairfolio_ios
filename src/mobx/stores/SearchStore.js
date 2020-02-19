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
import { PER_PAGE, PER_PAGE_FOR_SEARCH, PER_PAGE_FOR_HASH_TAGS } from "../../constants";

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
  @observable selectedTags = [];
  @observable callingApi = false;
  
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
      if(this.callingApi == false || this.callingApi == 'false'){
        this.callingApi = true;
        this.isLoadingNextPage = true;

        let myId = UserStore.user.id;

        let res = await ServiceBackend.get(
          `tags/all_tags?page=${this.nextPage}&limit=${PER_PAGE_FOR_HASH_TAGS}`
        );

        let { tags, meta } = res;

        let arr = [];

        for (let a = 0; a < tags.length; a++) {
          let tagItem = new TagItem();
          await tagItem.init(tags[a]);
          this.elements.push(tagItem);
        }

        if(meta)
          this.nextPage = meta.next_page;

        this.isLoadingNextPage = false;
        this.callingApi = false;
      }
    }
  }
}

class TrendingPosts extends PostGridStore {
  @observable trendingMainRes = [];
  @observable trendingRes = [];
  @observable trendingTotalCount = 0;

  list(queryType) {
    let arr = [];
    arr = this.trendingRes.slice();
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

  list2(queryType) {
    let arr = [];
    arr = this.trendingRes.slice();
    let newArr = [];
    let counter = 0;
    while (counter < 6) {
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
    let res = await ServiceBackend.get('homepages?query=trending');
    this.isLoading = false;
    this.trendingMainRes = res.homepage;
    showLog("trendingMainRes ==> " + this.trendingMainRes.id)
    let posts=[];
    posts = res.homepage.posts;
    let totalLength = PER_PAGE_FOR_SEARCH;
    if (posts) {
      this.trendingTotalCount = posts.length;
      totalLength = (posts.length < PER_PAGE_FOR_SEARCH) ? posts.length : PER_PAGE_FOR_SEARCH;
      this.trendingRes = [];
      for (let a = 0; a < totalLength; a++) {
        let post = new Post();
        await post.init(posts[a]);
        this.trendingRes.push(post);
      } 
    }
  }

  async load() {
    this.isLoading = true;
    this.trendingRes = [];
    await this.getPosts();
    this.isLoading = false;
    this.isLoadingNextPage = false;
  }
}

class EditorPosts extends PostGridStore {
  @observable editorMainRes = [];
  @observable editorsRes = [];
  @observable editorsTotalCount = 0;

  list() {
    let arr = [];
    arr = this.editorsRes.slice();
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

  list2() {
    let arr = [];
    arr = this.editorsRes.slice();
    let newArr = [];
    let counter = 0;

    let length = arr.length
    if(arr.length > 6)
    {
      length = 6
    }

    while (counter < length) {
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
    let res = await ServiceBackend.get('homepages?query=editor');
    this.isLoading = false;
    this.editorMainRes = res.homepage;
    let posts=[];
    posts = res.homepage.posts;
    let totalLength = PER_PAGE_FOR_SEARCH;
    if (posts) {
      this.editorsTotalCount = posts.length;
      totalLength = (posts.length < PER_PAGE_FOR_SEARCH) ? posts.length : PER_PAGE_FOR_SEARCH;
      this.editorsRes = [];
      for (let a = 0; a < totalLength; a++) {
        let post = new Post();
        await post.init(posts[a]);
        this.editorsRes.push(post);
      }
    }
  }

  async load() {
    this.isLoading = true;
    this.editorsRes = [];
    await this.getPosts();
    this.isLoading = false;
    this.isLoadingNextPage = false;
  }
}

class HashtagPosts extends PostGridStore {
  @observable hashtagPostsList = [];
  @observable selectedTags = [];
  @observable totalCount = 0;
  @observable nextPage = 1;

  async onTagClick(id) {
    let index = this.selectedTags.findIndex(obj => obj == id);
    if(index >= 0) {
      this.selectedTags.splice(index, 1);
    } else {  
      this.selectedTags.push(id);
    }

    this.load();
  }

  async getPosts(page) {
    let postData = {
      tag_ids: this.selectedTags
    };
    let res = await ServiceBackend.post(`posts/hashtag_posts?per_page=${PER_PAGE_FOR_SEARCH}&page=${page}`,postData);
    return res;   
  }

  async load() {
    this.isLoading = true;
    this.nextPage = 1;
    await this.loadNextPage();
    this.isLoading = false;   
  }

  async loadNextPage() {
    if(this.nextPage != null) {
      this.isLoading = true;
      let res = await this.getPosts(this.nextPage);
      if(res) {
        if(this.nextPage == 1) {
          this.hashtagPostsList = [];
        }
        let meta = res.meta;
        if (meta && meta.total_count) {
          this.totalCount = meta.total_count;
          this.nextPage = meta.next_page;
        }
        if(res.posts) {
          this.postsList = res.posts;
          this.postsList.map(async (item,i) => {
            let post = new Post();
            await post.init(item);
            this.hashtagPostsList.push(post);    
          })
        }
      }
      this.isLoading = false;
      showLog("hashtagPostsList ==> " + JSON.stringify(this.hashtagPostsList));
    }
  }

  list2() {
    let arr = [];
    arr = this.hashtagPostsList.slice();
    let newArr = [];
    let counter = 0;
    let length = arr.length
    if(arr.length > 6)
    {
      length = 6
    }
    while (counter < length) {
      if (counter + 1 < arr.length) {
        newArr.push([arr[counter], arr[counter + 1]]);
      } else {
        newArr.push([arr[counter], null]);
      }
      counter += 2;
    }
    return newArr;
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
  @observable callingApi = false;

  constructor(){
    super();
    this.nextPage = 1;
    this.allSearchResult = [];
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

  list2() {
    let arr = [];
    if(this.allSearchResult.length > 0) {
      arr = this.allSearchResult.slice();
    } 
    let newArr = [];
    let counter = 0;

    let length = arr.length
    if(arr.length > 6)
    {
      length = 6
    }
    while (counter < length) {
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

    while (counter < PER_PAGE_FOR_SEARCH) {
      if (counter + 1 < PER_PAGE_FOR_SEARCH) {
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
    this.nextPage = 1;
    this.allSearchResult = [];
    SearchStore.detailListDataSource;
    if(this.nextPage != null) {   
      showLog("this.allSearchResult.length before ==> " + this.allSearchResult.length) 
      // console.log(`${this.allSearchResult.length} <== Helloo ==> homepages_posts?id=${id}&page=${this.nextPage}`)
      if(this.callingApi == false || this.callingApi == 'false'){
        this.callingApi= true;
        let res = await ServiceBackend.get(`homepages_posts?id=${id}&page=${this.nextPage}&per_page=${PER_PAGE_FOR_SEARCH}`);

        if (res) {

          console.log("cool getPosts ==>" + JSON.stringify(res));

          this.isLoading = false;
          let posts = (res.posts) ? res.posts : [];
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
        this.callingApi= false;
      }
    }
    showLog("this.allSearchResult.length ==> " + this.allSearchResult.length) 
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

    // console.log(`${this.allSearchResult.length} <== Helloo ==> homepages_posts?id=${id}&page=${this.nextPage}`)
    if(this.callingApi == false || this.callingApi == 'false'){
    if (this.nextPage != null) {
      this.callingApi= true;
      let res = await ServiceBackend.get(`homepages_posts?id=${id}&page=${this.nextPage}&per_page=${PER_PAGE_FOR_SEARCH}`);
      if(res){
        console.log("loadNextPage getPosts ==>" + JSON.stringify(res));
        let posts = (res.posts) ? res.posts : [];
        let meta = res.meta;
        this.nextPage = meta.next_page;
        for (let a = 0; a < posts.length; a++) {
          let post = new Post();
          await post.init(posts[a]);
          this.allSearchResult.push(post);
        }

      }
      this.callingApi= false;
    }
  }
  }
  
}

class StylistsList extends PostGridStore{
  @observable isLoadingNextPage = false;
  @observable nextPage;  
  @observable totalCount = 0;
  @observable limit = 25;
  @observable callingApi=false;
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

  list2() {
    let arr = [];
    if(this.elements.length > 0) {
      arr = this.elements.slice();
    } 
    let newArr = [];
    let counter = 0;

    let length = arr.length
    if(arr.length > 6)
    {
      length = 6
    }

    while (counter < length) {
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
    this.isLoading = true;
    if (!this.isLoadingNextPage && this.nextPage != null) {
      if(this.callingApi == false || this.callingApi == "false") {
        this.callingApi = true;
        let res = await this.getPosts(this.nextPage);
        if (res) {
          let meta = res.meta;
          let users = (res.users) ? res.users : [];
          this.isLoading = false;

          if (meta && meta.total_count) {
            this.totalCount = meta.total_count;
          }

          if (users) {
            let totalLength = (this.totalCount<PER_PAGE_FOR_SEARCH) ? this.totalCount : (users.length < PER_PAGE_FOR_SEARCH) ? users.length : PER_PAGE_FOR_SEARCH;
            for (let a = 0; a < totalLength; a++) {
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
          } else {
            this.nextPage = null;
            this.isLoadingNextPage = false;
            throw res.errors;
          }
        }
      this.callingApi = false;
      }
    } else {
      this.callingApi = false;
      this.nextPage = null;
      this.isLoading = false;
      this.isLoadingNextPage = false;
    }
  }


  async getUserLocation2() {
    showLog("GET CURRENT LOCATION")
    // navigator.geolocation.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // this.setState({
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        //   error: null,
        // });
      },
      (error) => {alert("ERROR LOCATION "+JSON.stringify(error))},
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }


  async getUserLocation() {
    showLog("GET CURRENT LOCATION")
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej, {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 1000
      });
    });
  }

  async getPosts(page = PER_PAGE_FOR_SEARCH) { 
    let position = await this.getUserLocation();
    // return await ServiceBackend.get(`/users/stylist_near_me?latitude=23.01952&longitude=72.5475328?limit=${page}`);
    // return await ServiceBackend.get(`users/stylist_near_me?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
    if(position && position.coords)
    { 
      return await ServiceBackend.get(`users/stylist_near_me?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&limit=${PER_PAGE_FOR_SEARCH}&page=${this.nextPage}`);
    } else {
      this.nextPage = 1;
      this.isLoadingNextPage = false;
      this.isLoading = false;
      return null;
    }
  }
}

class SearchStore {
  // @observable popularPosts;
  @observable topTags;
  @observable isLoading = false;
  @observable loaded;
  @observable editorsPosts;
  @observable stylistsList;
  @observable trendingPosts;
  @observable searchString;
  @observable searchAllList;
  @observable hashtagPosts;
  @observable hashtagSixPosts;
  @observable isIconVisible = (this.searchString && this.searchString.length > 0 ) ? true : false
  @observable nextPage; 
  @observable list_all_new; 
  @observable searchResult;
  // @observable accountType = 'stylist';
  // @observable accountDisplayText = 'Hair Stylist';
  @observable accountType = 'all_tags';
  @observable accountDisplayText = 'All Tags';
  @observable callingApi = false;
  constructor() {
    this.elements = [];
    this.searchString = '';
    this.loaded = false;
    this.topTags = new TopTags();
    // this.popularPosts = new PopularPosts();
    this.editorsPosts = new EditorPosts();
    this.stylistsList = new StylistsList();
    this.trendingPosts = new TrendingPosts();
    this.hashtagPosts = new HashtagPosts();
    this.searchAllList = new SearchAllList();
    this.searchResult = [];
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


  list() {
    let arr = [];
    if(this.searchResult.length > 0) {
      arr = this.searchResult.slice();
    } 
    let newArr = [];
    let counter = 0;

    while (counter < this.searchResult.length) {
      if (counter + 1 < this.searchResult.length) {
        newArr.push([arr[counter], arr[counter + 1]]);
      } else {
        newArr.push([arr[counter], null]);
      }
      counter += 2;
    }
    return newArr;
  }

  list2() {
    let arr = [];
    if(this.searchResult.length > 0) {
      arr = this.searchResult.slice();
    } 
    let newArr = [];
    let counter = 0;

    let length = arr.length
    if(arr.length > 6)
    {
      length = 6
    }
 
    while (counter < length) {
      if (counter + 1 < this.searchResult.length) {
        newArr.push([arr[counter], arr[counter + 1]]);
      } else {
        newArr.push([arr[counter], null]);
      }
      counter += 2;
    }
    return newArr;
  }

  updateValues() {
    let temp = this.searchString;
    let v = (temp && temp.length ) > 0;
    this.isIconVisible = v; 
    showLog(this.isIconVisible + ' v=== ' + temp)
    this.searchResult.clear();
  }

  // loadNextPage(id) {
  //   if(id) {
  //     this.loadAllTrendingEditorsPosts(id)
  //   } else {
  //     this.stylistsList.loadNextPage();
  //     this.searchAllList.push(this.stylistsList.list)
  //   }
  // }

  // async loadAllTrendingEditorsPosts(id) {
  //   this.isLoading = true;
  //   let res = await ServiceBackend.get(`homepages_posts?id=${id}&page=${this.nextPage}&per_page=${PER_PAGE}`);
  //   this.isLoading = false;
  //   let posts = res.posts
  //   if (posts) {
  //     for (let a = 0; a < posts.length; a++) {
  //       // let post = new Post();
  //       // await post.init(posts[a]);
  //       this.searchAllList.push(post);
  //     }
  //   }      
  // }

  @computed get trendingDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      ...this.trendingPosts.list()
    ]);
  }

  @computed get trendingFewDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      ...this.trendingPosts.list2()
    ]);
  }

  @computed get editorsDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      ...this.editorsPosts.list()
    ]);
  }

  @computed get editorsFewDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      ...this.editorsPosts.list2()
    ]);
  }

  @computed get hashtagPostFewDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    // showLog("HASH LIST ==> "+JSON.stringify(this.hashtagPosts.list2().hashtagPostsList))
    // alert("HASH LIST ==> "+JSON.stringify(this.hashtagPosts.list().hashtagPostsList))
    return ds.cloneWithRows([

      ...this.hashtagPosts.list2()
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
      ...this.stylistsList.list()
    ]);
  }

  @computed get stylistsListFewDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      ...this.stylistsList.list2()
    ]);
  }


  @computed get detailListDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      ...this.searchAllList.list()
    ]);
  }

  @computed get detailListFewDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      ...this.searchAllList.list2()
    ]);
  }


  

  @computed get searchDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.list());
  }

  @computed get searchFewDataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    return ds.cloneWithRows(this.list2());
  }

  refresh() {
    this.loaded = false;
  }

  async load() {
    if (!this.loaded) {
      // this.popularPosts.load();
      this.topTags.load();
      this.trendingPosts.load();
      this.editorsPosts.load();
      this.stylistsList.load();
      // this.searchAllList.load();
      this.hashtagPosts.load();
      this.loaded = true;
    }
  }

  async loadSearch() {
    this.searchResult = [];
    this.nextPage = 1;
    await this.loadNextSearch();
  }

  async getSearchPost(page) {
    let res = [];
    if(this.accountType == 'all_tags') {
      res = await ServiceBackend.get(`posts/search_by_tags?term=${this.searchString}&page=${page}&limit=${PER_PAGE_FOR_SEARCH}`);
      return res;
    } else {
      res = await ServiceBackend.get(`users/search_profile?account_type=${this.accountType}&q=${this.searchString}&page=${page}&limit=${PER_PAGE_FOR_SEARCH}`);
      return res;
    }
  }

  async loadNextSearch() {
    if(this.nextPage != null) {
      if(this.callingApi == false || this.callingApi == 'false'){
        this.callingApi = true;
        let res = await this.getSearchPost(this.nextPage);
        if(res) {
          if(this.accountType == 'all_tags') {
            if(res.posts) {
              let meta = res.meta;
              let posts = (res.posts) ? res.posts : [];
              if (meta && meta.total_count) {
                this.totalCount = meta.total_count;
                this.nextPage = meta.next_page;
              }
              if(posts){
                if(posts.length > 0) {
                  let totalLength = (this.totalCount < PER_PAGE_FOR_SEARCH) ? this.totalCount : (posts.length < PER_PAGE_FOR_SEARCH) ? posts.length : PER_PAGE_FOR_SEARCH;
                  for (let a = 0; a < totalLength; a++) {
                    let post = new Post();
                    await post.init(posts[a]);
                    this.searchResult.push(post);
                  }
                } else {
                  this.searchResult.clear();
                }
              }
            }
          } else {
            if(res.users){
              let meta = res.meta;
              let users = (res.users) ? res.users : [];
              if (meta && meta.total_count) {
                this.totalCount = meta.total_count;
                this.nextPage = meta.next_page;
              }
              if (users) {
                if(users.length > 0) {
                  let totalLength = (this.totalCount<PER_PAGE_FOR_SEARCH) ? this.totalCount : (users.length < PER_PAGE_FOR_SEARCH) ? users.length : PER_PAGE_FOR_SEARCH;   
                  for (let a = 0; a < totalLength; a++) {
                    let user = new FollowUser();
                    await user.init(users[a]);
                    this.searchResult.push(user);
                  }
                } else {
                  this.searchResult.clear();
                }
              }
            }
          }
        }
        this.callingApi = false;
      }
    }
  }

  async search() {
    this.isLoading = true;
    await this.loadSearch();    
    this.isLoading = false;
  }

  reset() {
    this.elements = [];
    this.loaded = false;
    this.topTags = new TopTags();
    // this.popularPosts = new PopularPosts();
    this.editorsPosts = new EditorPosts();
    this.stylistsList = new StylistsList();
    this.trendingPosts = new TrendingPosts();
    this.searchAllList = new SearchAllList();
    this.hashtagPosts = new HashtagPosts();
    this.searchString = "";
  }
}

const store = new SearchStore();

export default store;

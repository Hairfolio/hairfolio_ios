import { computed, observable } from "mobx";
import { ListView, NativeModules } from "react-native";
import { v4 } from "uuid";
import ServiceBackend from "../../backend/ServiceBackend";
import Picture from "./Picture";
import PostStore, { PostGridStore } from "./PostStore";
import UserStore from "./UserStore";
import { showLog } from "../../helpers";

let PhotoAlbum = NativeModules.PhotoAlbum;

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

class PopularPosts extends PostGridStore {
  async getPosts(page) {
    return await ServiceBackend.get(`trending_posts?page=${page}`);
  }
}

class SearchStore {
  @observable popularPosts;
  @observable topTags;
  @observable isLoading = false;
  @observable loaded;

  constructor() {
    this.elements = [];
    this.loaded = false;
    this.topTags = new TopTags();
    this.popularPosts = new PopularPosts();
  }

  @computed get dataSource() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    return ds.cloneWithRows([
      { type: "searchBar" },
      { type: "topTags" },
      { type: "popularPostHeader" },
      ...this.popularPosts.list
    ]);
  }

  refresh() {
    this.loaded = false;
  }

  async load() {
    if (!this.loaded) {
      this.popularPosts.load();
      this.topTags.load();
      this.loaded = true;
    }
  }

  reset() {
    this.elements = [];
    this.loaded = false;
    this.topTags = new TopTags();
    this.popularPosts = new PopularPosts();
  }
}

const store = new SearchStore();

export default store;

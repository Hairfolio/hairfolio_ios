import {observable, computed, action} from 'mobx';
import ServiceBackend from 'backend/ServiceBackend.js'

import {_, v4, moment} from 'hairfolio/src/helpers';

import FollowUser from 'stores/FollowUser.js'

class SearchUserFollowStore {
  @observable users = [];
  @observable isLoading = false;
  @observable wasLoaded = false;

  constructor() {
  }

  reset() {
    this.wasLoaded = false;
  }



  async search(param) {

    this.isLoading = true;

    let users = await this.backendSearch(param);
    console.log('backend res', users);

    let userList = users.map(e => {
      let user = new FollowUser();
      return user.init(e);
    });

    console.log('userList', userList);

    this.users = await Promise.all(userList);

    console.log('stylists ', this.StylistSearchStore);

    this.wasLoaded = true;

    this.isLoading = false;

  }

  @computed get isEmpty() {
    return this.users.length == 0;
  }
}

class SearchStylistStore extends SearchUserFollowStore {
  async backendSearch(name) {
    let searchString =  `users?account_type=stylist&keyword=${name}`;
    return await ServiceBackend.get(searchString);
  }
}

class SearchBrandStore extends SearchUserFollowStore {
  async backendSearch(name) {
    return await ServiceBackend.get(`users?account_type=brand&keyword=${name}`);
  }
}

class SearchSalonStore extends SearchUserFollowStore {
  async backendSearch(name) {
    return await ServiceBackend.get(`users?account_type=salon&keyword=${name}`);
  }
}

class Tag {
  constructor(obj) {
    console.log('hash', obj);
    this.key = v4();
    this.name = `#${obj.name}`;
  }
}

class SearchHashStore {
  @observable tags = [];
  @observable isLoading = false;
  @observable wasLoaded = false;


  reset() {
    this.wasLoaded = false;
  }

  async search(name) {

    this.isLoading = true;
    console.log('testloading');

    let searchString = `hashtags?name=${name}`;
    console.log('hashtags SearchString', searchString);
    let hashtags = await ServiceBackend.get(searchString);
    console.log('hashtags', hashtags);
    this.tags = hashtags.map(e => new Tag(e));


    this.wasLoaded = true;
    this.isLoading = false;
  }
}

class SearchDetailsStore {

  @observable stylistStore = new SearchStylistStore();
  @observable brandStore = new SearchBrandStore();
  @observable salonStore = new SearchSalonStore();
  @observable hashStore = new SearchHashStore();

  @observable searchString;

  search() {
    const name = this.searchString;
    this.stylistStore.search(name);
    this.brandStore.search(name);
    this.salonStore.search(name);
    this.hashStore.search(name);
  }

  reset() {
    this.stylistStore.reset();
    this.brandStore.reset();
    this.salonStore.reset();
    this.hashStore.reset();
    this.searchString = '';
  }
}

const store = new SearchDetailsStore();

export default store;

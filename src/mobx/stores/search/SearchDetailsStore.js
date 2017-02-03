import {observable, computed, action} from 'mobx';
import ServiceBackend from 'backend/ServiceBackend.js'

import {_, v4, moment} from 'hairfolio/src/helpers';

import FollowUser from 'stores/FollowUser.js'

import {GeoLocation} from 'react-native'

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

    let users = (await this.backendSearch(param)).users;
    console.log('backend res', users);

    let userList = users.map(e => {
      let user = new FollowUser();
      return user.init(e);
    });

    console.log('userList', userList);

    this.users = await Promise.all(userList);

    this.wasLoaded = true;

    this.isLoading = false;

  }

  @computed get isEmpty() {
    return this.users.length == 0;
  }
}

class SearchStylistStore extends SearchUserFollowStore {
  async backendSearch(name) {
    let searchString =  `users?account_type=stylist&q=${name}`;
    return await ServiceBackend.get(searchString);
  }
}

class SearchBrandStore extends SearchUserFollowStore {
  async backendSearch(name) {
    return await ServiceBackend.get(`users?account_type=ambassador&q=${name}`);
  }
}

class SearchSalonStore extends SearchUserFollowStore {
  async backendSearch(name) {
    return await ServiceBackend.get(`users?account_type=owner&q=${name}`);
  }
}


class SearchNearbyStore extends SearchUserFollowStore {

  async getUserLocation() {
    return new Promise((res, rej) => {
      window.navigator.geolocation.getCurrentPosition(
        res,
        rej,
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
      );
    });

  }
  async backendSearch(name) {
    let position = await this.getUserLocation();
    console.log('position', position);

    let url = `salons?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&q=${name}`;

    console.log('url', url);


    return await ServiceBackend.get(url);
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

    let searchString = `tags?q=${name}`;
    console.log('hashtags SearchString', searchString);
    let hashtags = (await ServiceBackend.get(searchString)).tags;
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
  @observable nearbyStore = new SearchNearbyStore();

  @observable searchString;

  search() {
    const name = this.searchString;
    this.stylistStore.search(name);
    this.brandStore.search(name);
    this.salonStore.search(name);
    this.hashStore.search(name);
    this.nearbyStore.search(name);
  }

  reset() {
    this.stylistStore.reset();
    this.brandStore.reset();
    this.salonStore.reset();
    this.hashStore.reset();
    this.nearbyStore.reset();
    this.searchString = '';
  }
}

const store = new SearchDetailsStore();

export default store;

import {observable, computed, action} from 'mobx';
import ServiceBackend from 'backend/ServiceBackend.js'

import {_, v4, moment} from 'hairfolio/src/helpers';

import FollowUser from 'stores/FollowUser.js'


class StylistSearchStore {
  @observable users = [];
  @observable isLoading = false;

  constructor() {
  }

  async load() {

    this.isLoading = true;

    let users = (await ServiceBackend.get('users?account_type=stylist')).users;
    console.log('backend res', users);

    let userList = users.map(e => {
      let user = new FollowUser();
      return user.init(e);
    });

    console.log('userList', userList);

    this.users = await Promise.all(userList);

    console.log('stylists ', this.StylistSearchStore);

    this.isLoading = false;

  }

  @computed get isEmpty() {
    return this.users.length == 0;
  }
}

const store = new StylistSearchStore();

export default store;

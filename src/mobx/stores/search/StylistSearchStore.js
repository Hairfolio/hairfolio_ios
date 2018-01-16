import {observable, computed, action} from 'mobx';
import ServiceBackend from '../../backend/ServiceBackend';

import {_, v4, moment} from 'Hairfolio/src/helpers';

import FollowUser from './FollowUser';


class StylistSearchStore {
  @observable users = [];
  @observable isLoading = false;

  constructor() {
  }

  async load() {

    this.isLoading = true;

    let users = (await ServiceBackend.get('users?account_type=stylist')).users;
    let userList = users.map(e => {
      let user = new FollowUser();
      return user.init(e);
    });

    this.users = await Promise.all(userList);

    this.isLoading = false;

  }

  @computed get isEmpty() {
    return this.users.length == 0;
  }
}

const store = new StylistSearchStore();

export default store;
